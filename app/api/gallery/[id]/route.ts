import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import mongoose from "mongoose";
// Import the model directly. Ensure IGalleryEvent and IGalleryImage are exported there.
import GalleryEventSource, {
  IGalleryEvent,
  IGalleryImage,
} from "@/models/GalleryEvent";

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

// BYPASS UNION COMPILATION CONFLICTS BY CASTING DIRECTLY FROM YOUR TYPED MODEL SOURCE
const GalleryEvent = GalleryEventSource as mongoose.Model<IGalleryEvent>;

const generateSlug = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ==========================================
// GET /api/gallery/[id]
// ==========================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const event = await GalleryEvent.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: "Gallery event record not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch event." },
      { status: 500 },
    );
  }
}

// ==========================================
// PUT /api/gallery/[id]
// ==========================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const localUploadedKeys: string[] = [];

  try {
    await connectDB();
    const { id } = await params;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || "us-east-1";

    const targetEvent = await GalleryEvent.findById(id);
    if (!targetEvent) {
      return NextResponse.json(
        { error: "Target gallery event not found." },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const titleEn = formData.get("titleEn") as string | null;
    const titleTa = formData.get("titleTa") as string | null;
    const descriptionEn = formData.get("descriptionEn") as string | null;
    const descriptionTa = formData.get("descriptionTa") as string | null;
    const category = formData.get("category") as string | null;
    const eventDateStr = formData.get("eventDate") as string | null;
    const files = formData.getAll("images") as File[];

    if (titleEn) targetEvent.titleEn = titleEn;
    if (titleTa) targetEvent.titleTa = titleTa;
    if (descriptionEn !== null) targetEvent.descriptionEn = descriptionEn;
    if (descriptionTa !== null) targetEvent.descriptionTa = descriptionTa;
    if (category) targetEvent.category = category.toLowerCase().trim() as any;
    if (eventDateStr) targetEvent.eventDate = new Date(eventDateStr);

    if (
      files &&
      files.length > 0 &&
      files[0] instanceof File &&
      files[0].size > 0
    ) {
      if (!bucketName) {
        return NextResponse.json(
          { error: "S3 environment bucket missing configuration context." },
          { status: 500 },
        );
      }

      const currentSlug = generateSlug(targetEvent.titleEn);
      const newImagesArray: IGalleryImage[] = [];

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueFilename = `${Date.now()}-${generateSlug(file.name)}`;
        const s3KeyPath = `gallery/${targetEvent.category}/${currentSlug}/${uniqueFilename}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: s3KeyPath,
            Body: buffer,
            ContentType: file.type,
            CacheControl: "max-age=31536000",
          }),
        );

        localUploadedKeys.push(s3KeyPath);

        newImagesArray.push({
          url: `https://${bucketName}.s3.${region}.amazonaws.com/${s3KeyPath}`,
          s3Key: s3KeyPath,
        });
      }

      // Safe update approach: Combine existing images with newly prepared elements
      targetEvent.images = [...(targetEvent.images || []), ...newImagesArray];
    }

    await targetEvent.save();
    return NextResponse.json(
      { success: true, data: targetEvent },
      { status: 200 },
    );
  } catch (error: any) {
    // S3 Rollback Pipeline Integration
    for (const key of localUploadedKeys) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
          }),
        );
      } catch (err) {
        console.error(`Rollback failure for key: ${key}`, err);
      }
    }
    return NextResponse.json(
      { error: error.message || "Failed to update record updates." },
      { status: 500 },
    );
  }
}

// ==========================================
// DELETE /api/gallery/[id]
// ==========================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const targetEvent = await GalleryEvent.findById(id);
    if (!targetEvent) {
      return NextResponse.json(
        { error: "Target gallery event already missing." },
        { status: 404 },
      );
    }

    if (targetEvent.images && targetEvent.images.length > 0) {
      if (!bucketName) {
        return NextResponse.json(
          { error: "AWS Bucket context dropped. Purge sequence halted." },
          { status: 500 },
        );
      }

      for (const img of targetEvent.images) {
        if (img.s3Key) {
          try {
            await s3.send(
              new DeleteObjectCommand({ Bucket: bucketName, Key: img.s3Key }),
            );
          } catch (s3Err) {
            console.error(
              `⚠️ Failed clearing S3 key location: ${img.s3Key}`,
              s3Err,
            );
          }
        }
      }
    }

    await GalleryEvent.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Event assets and records cleanly purged." },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Delete operations aborted." },
      { status: 500 },
    );
  }
}
