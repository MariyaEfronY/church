import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { connectDB } from "@/lib/mongodb"; // 🏛️ Kept your exact DB helper path
import Announcement from "@/models/Announcement";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// PUT: Edit existing record + conditionally parse append incoming images
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // 🛡️ Updated to Promise for Next.js async guidelines
) {
  await connectDB();
  try {
    // 🛡️ Await the dynamic parameters array before pulling the id out
    const { id } = await params;
    const formData = await req.formData();

    // Read list of image keys the client explicitly wants to keep
    const retainedImagesRaw = formData.get("retainedImages") as string;
    let updatedImagesList = retainedImagesRaw
      ? JSON.parse(retainedImagesRaw)
      : [];

    // Find document to read files that were completely dropped during edit to wipe them off S3
    const existingDoc = await Announcement.findOne({ _id: id });
    if (!existingDoc) {
      return NextResponse.json(
        { success: false, message: "Record missing" },
        { status: 404 },
      );
    }

    // Identify dropped images and wipe from S3
    const keptKeys = new Set(updatedImagesList.map((img: any) => img.s3Key));
    for (const oldImg of existingDoc.images) {
      if (!keptKeys.has(oldImg.s3Key)) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: oldImg.s3Key,
          }),
        );
      }
    }

    // Process entirely new file selections added during edit mode
    const newFiles = formData.getAll("newImages") as File[];
    for (const file of newFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const s3Key = `announcements/${uniqueFilename}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: s3Key,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
      updatedImagesList.push({ url, s3Key });
    }

    existingDoc.images = updatedImagesList;
    await existingDoc.save();

    return NextResponse.json({ success: true, data: existingDoc });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE: Completely wipe record from database & scrub files out of S3
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // 🛡️ Updated to Promise for Next.js async guidelines
) {
  await connectDB();
  try {
    // 🛡️ Await the dynamic parameters array before pulling the id out
    const { id } = await params;
    const target = await Announcement.findById(id);
    if (!target) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );
    }

    // Clean drop every single associated asset out of S3 cloud bucket
    for (const img of target.images) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: img.s3Key,
        }),
      );
    }

    await target.deleteOne();
    return NextResponse.json({
      success: true,
      message: "Announcement cleanly destroyed",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
