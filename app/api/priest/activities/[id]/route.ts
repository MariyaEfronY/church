import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";

// Define params type explicitly as a Promise for Next.js 15/16 compliance
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await connectDB();

    // 🌟 THE FIX: Await the params Promise before extracting properties
    const { id } = await params;

    const formData = await req.formData();

    const currentActivity = await Activity.findById(id);
    if (!currentActivity) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 },
      );
    }

    const updateData: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      activityDate: formData.get("activityDate")
        ? new Date(formData.get("activityDate") as string)
        : currentActivity.activityDate,
    };

    const file = formData.get("image") as File | null;

    if (file && file.size > 0 && file.type.startsWith("image/")) {
      const bucketName = process.env.AWS_BUCKET_NAME || "your-parish-bucket";

      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: currentActivity.s3Key,
          }),
        );
      } catch (err) {
        console.error("S3 Old object cleanup skip:", err);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split(".").pop();
      const newS3Key = `activities/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: newS3Key,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      updateData.s3Key = newS3Key;
      updateData.s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${newS3Key}`;
    }

    const updated = await Activity.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await connectDB();

    // 🌟 THE FIX: Await the params Promise here as well
    const { id } = await params;

    const activity = await Activity.findById(id);
    if (!activity)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME || "your-parish-bucket",
          Key: activity.s3Key,
        }),
      );
    } catch (err) {
      console.error("S3 asset missing or already clean:", err);
    }

    await Activity.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Successfully deleted record and media" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
