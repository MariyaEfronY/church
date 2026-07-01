import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import mongoose, { Schema, Document } from "mongoose";

// ==========================================
// 1. AWS S3 CLIENT INITIALIZATION
// ==========================================
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// ==========================================
// 2. MONGODB DATABASE CONNECTION LAYER
// ==========================================
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) {
    throw new Error(
      "Missing database connection string configurations (MONGODB_URI / MONGO_URI) inside environmental context.",
    );
  }
  await mongoose.connect(MONGODB_URI);
}

// ==========================================
// 3. MONGOOSE SCHEMA & MODEL DEFINITIONS
// ==========================================
export interface IGalleryImage {
  url: string;
  s3Key: string;
}

export interface IGalleryEvent extends Document {
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  category: "general" | "feast" | "mass" | "youth";
  eventDate: Date;
  images: IGalleryImage[];
  isExpired: boolean;
  createdAt: Date;
}

const GalleryEventSchema: Schema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleTa: { type: String, required: true, trim: true },
    descriptionEn: { type: String, default: "" },
    descriptionTa: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["general", "feast", "mass", "youth"],
      default: "general",
      index: true,
    },
    eventDate: { type: Date, required: true },
    images: [
      {
        url: { type: String, required: true },
        s3Key: { type: String, required: true },
      },
    ],
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Synchronous Mongoose Pre-Save Lifecycle Hook
// Synchronous Mongoose Pre-Save Lifecycle Hook
GalleryEventSchema.pre<IGalleryEvent>("save", function () {
  if (this.eventDate) {
    const eventTime = (this.eventDate as Date).getTime();
    this.isExpired = eventTime < Date.now();
  }
});

// Prevents model recompilation execution errors during Hot Module Replacement reloads
const GalleryEvent =
  (mongoose.models.GalleryEvent as mongoose.Model<IGalleryEvent>) ||
  mongoose.model<IGalleryEvent>("GalleryEvent", GalleryEventSchema);

// Helper to sanitize filenames & slugs safely for S3 URL structural layouts
const generateSlug = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// ==========================================
// 4. CORE ROUTE PIPELINE HANDLERS
// ==========================================

/**
 * GET: Fetch a single event's full details
 * Path: /api/gallery/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 16 Asynchronous Params Resolution

    const event = await GalleryEvent.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: "Gallery event row not found." },
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

/**
 * POST: Create a fresh event record and upload initial assets
 * Path: /api/gallery
 */
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

    if (
      !titleEn ||
      !titleTa ||
      !eventDateStr ||
      files.length === 0 ||
      !(files[0] instanceof File) ||
      files[0].size === 0
    ) {
      return NextResponse.json(
        { error: "Missing required upload metadata fields or image binaries." },
        { status: 400 },
      );
    }

    const eventSlug = generateSlug(titleEn);
    const uploadedImagesArray = [];

    // Stream image file buffers up to AWS S3 Bucket
    for (const file of files) {
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

    // Write structure data blocks through document instantiation to ensure pre-save hook executes
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
    // Atomic Transaction Rollback: Clean up storage orphans if database operation faults
    for (const key of uploadedS3Keys) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
          }),
        );
      } catch (err) {
        console.error(`Rollback failed for orphaned S3 asset: ${key}`, err);
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

/**
 * PUT: Update text fields and/or append new image assets
 * Path: /api/gallery/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const localUploadedKeys: string[] = [];
  try {
    await connectDB();
    const { id } = await params; // Next.js 16 Asynchronous Params Resolution

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || "us-east-1";

    const targetEvent = await GalleryEvent.findById(id);
    if (!targetEvent) {
      return NextResponse.json(
        { error: "Target gallery record does not exist." },
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

    // Track dynamic changes straight into the Mongoose record reference
    if (titleEn) targetEvent.titleEn = titleEn;
    if (titleTa) targetEvent.titleTa = titleTa;
    if (descriptionEn !== null) targetEvent.descriptionEn = descriptionEn;
    if (descriptionTa !== null) targetEvent.descriptionTa = descriptionTa;
    if (category) targetEvent.category = category.toLowerCase().trim() as any;
    if (eventDateStr) targetEvent.eventDate = new Date(eventDateStr);

    // Process fresh appending image binaries if provided
    if (
      files &&
      files.length > 0 &&
      files[0] instanceof File &&
      files[0].size > 0
    ) {
      if (!bucketName) {
        return NextResponse.json(
          { error: "S3 Environment missing bucket configuration." },
          { status: 500 },
        );
      }

      const currentSlug = generateSlug(targetEvent.titleEn);

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
        targetEvent.images.push({
          url: `https://${bucketName}.s3.${region}.amazonaws.com/${s3KeyPath}`,
          s3Key: s3KeyPath,
        });
      }
    }

    await targetEvent.save(); // Automatically updates validation, formats, and handles isExpired changes

    return NextResponse.json(
      {
        success: true,
        message: "Gallery details and assets synced successfully.",
        data: targetEvent,
      },
      { status: 200 },
    );
  } catch (error: any) {
    // Rollback images uploaded during this single failed lifecycle update execution
    for (const key of localUploadedKeys) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
          }),
        );
      } catch (err) {
        console.error(`Rollback failure on key: ${key}`, err);
      }
    }
    return NextResponse.json(
      { error: error.message || "Failed to update record details." },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Purge document completely from cluster and wipe linked S3 objects
 * Path: /api/gallery/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 16 Asynchronous Params Resolution
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const targetEvent = await GalleryEvent.findById(id);
    if (!targetEvent) {
      return NextResponse.json(
        { error: "Target gallery event row already missing." },
        { status: 404 },
      );
    }

    // Completely clear out matching S3 cloud objects if keys exist
    if (targetEvent.images && targetEvent.images.length > 0) {
      if (!bucketName) {
        return NextResponse.json(
          { error: "AWS bucket config dropped. Purge halted." },
          { status: 500 },
        );
      }

      for (const img of targetEvent.images) {
        try {
          if (img.s3Key) {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: bucketName,
                Key: img.s3Key,
              }),
            );
          }
        } catch (s3Err) {
          console.error(
            `⚠️ Failed clearing S3 object path location: ${img.s3Key}`,
            s3Err,
          );
        }
      }
    }

    // Safely remove structural record row from database collection
    await GalleryEvent.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Event rows cleanly purged from cloud stack completely.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Failed to finalize database delete lifecycle.",
      },
      { status: 500 },
    );
  }
}
