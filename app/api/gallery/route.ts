import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
// Import the model directly to enforce absolute type security
import GalleryEventSource, { IGalleryEvent } from "@/models/GalleryEvent";

// 1. AWS S3 CLIENT INITIALIZATION
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// 2. DATABASE LAYER CONNECTION
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "";
  if (!uri)
    throw new Error("Missing MONGODB_URI/MONGO_URI configuration string.");
  await mongoose.connect(uri);
}

// FORCE TYPE CERTAINTY FOR THE TYPE CHECKER (Bypasses union compilation conflicts)
const GalleryEvent = GalleryEventSource as mongoose.Model<IGalleryEvent>;

const generateSlug = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ==========================================
// GET /api/gallery -> Fetch All Records
// ==========================================
export async function GET() {
  try {
    await connectDB();

    // Explicit typing ensures find query operations pass without error signatures
    const events = await GalleryEvent.find({}).sort({ eventDate: -1 });
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch gallery events." },
      { status: 500 },
    );
  }
}

// ==========================================
// POST /api/gallery -> Create Fresh Record
// ==========================================
export async function POST(req: NextRequest) {
  const uploadedS3Keys: string[] = [];

  try {
    await connectDB();
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || "us-east-1";

    if (!bucketName) {
      return NextResponse.json(
        { error: "Server asset environment configuration error." },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const titleEn = formData.get("titleEn") as string;
    const titleTa = formData.get("titleTa") as string;
    const descriptionEn = (formData.get("descriptionEn") as string) || "";
    const descriptionTa = (formData.get("descriptionTa") as string) || "";
    const category = ((formData.get("category") as string) || "general")
      .toLowerCase()
      .trim();
    const eventDateStr = formData.get("eventDate") as string;
    const files = formData.getAll("images") as File[];

    if (!titleEn || !titleTa || !eventDateStr) {
      return NextResponse.json(
        { error: "Missing required upload metadata fields." },
        { status: 400 },
      );
    }

    const eventSlug = generateSlug(titleEn);
    const uploadedImagesArray = [];

    // Stream image file buffers up to AWS S3 Bucket
    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueFilename = `${Date.now()}-${generateSlug(file.name)}`;
      const s3KeyPath = `gallery/${category}/${eventSlug}/${uniqueFilename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: s3KeyPath,
          Body: buffer,
          ContentType: file.type,
          CacheControl: "max-age=31536000",
        }),
      );

      uploadedS3Keys.push(s3KeyPath);
      uploadedImagesArray.push({
        url: `https://${bucketName}.s3.${region}.amazonaws.com/${s3KeyPath}`,
        s3Key: s3KeyPath,
      });
    }

    // Write structured data blocks directly via Model instantiation
    const newGalleryEvent = new GalleryEvent({
      titleEn,
      titleTa,
      descriptionEn,
      descriptionTa,
      category,
      eventDate: new Date(eventDateStr),
      images: uploadedImagesArray,
    });

    await newGalleryEvent.save();

    return NextResponse.json(
      { success: true, data: newGalleryEvent },
      { status: 201 },
    );
  } catch (error: any) {
    // S3 Rollback Pipeline Integration if DB initialization crashes
    for (const key of uploadedS3Keys) {
      try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (bucketName) {
          const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
          await s3.send(
            new DeleteObjectCommand({ Bucket: bucketName, Key: key }),
          );
        }
      } catch (err) {
        console.error(`Rollback failure for key: ${key}`, err);
      }
    }
    return NextResponse.json(
      {
        error: error.message || "Failed to process storage upload parameters.",
      },
      { status: 500 },
    );
  }
}
