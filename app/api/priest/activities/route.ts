import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract dynamic pagination metrics from URL search parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Run lookups in parallel to maximize performance
    const [activities, totalDocuments] = await Promise.all([
      Activity.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), // Converts records to lightweight JavaScript objects (saves memory)
      Activity.countDocuments({}),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: activities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalDocuments / limit),
          totalItems: totalDocuments,
          hasNextPage: skip + activities.length < totalDocuments,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const activityDate = formData.get("activityDate") as string;
    const file = formData.get("image") as File | null;

    if (!title || !description || !location || !file) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // 🛑 STAGE 1: Strict Image Content Validation Guardrail
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files (.jpg, .png, .webp) are allowed.",
        },
        { status: 400 },
      );
    }

    // Convert file object into buffer for S3 upload streaming
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const s3Key = `activities/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
    const bucketName = process.env.AWS_BUCKET_NAME || "your-parish-bucket";

    // 🚀 STAGE 2: Stream Upload direct payload to AWS S3
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // 💾 STAGE 3: Persist URL and identifiers directly to MongoDB
    const newActivity = await Activity.create({
      title,
      description,
      location,
      s3Url,
      s3Key,
      activityDate: activityDate ? new Date(activityDate) : new Date(),
    });

    return NextResponse.json(
      { success: true, data: newActivity },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Upload Route Processing Crash:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
