import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";

export async function GET() {
  try {
    await connectDB();
    const requests = await PrayerRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: requests },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, priestStatus } = await req.json();

    if (!id || !priestStatus) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing document ID or priestStatus target value",
        },
        { status: 400 },
      );
    }

    if (
      !["Pending", "Accepted", "Completed", "Rejected"].includes(priestStatus)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid priest status classification" },
        { status: 400 },
      );
    }

    // Alter both priestStatus and record the timestamp automatically
    const updatedRequest = await PrayerRequest.findByIdAndUpdate(
      id,
      {
        priestStatus: priestStatus,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, message: "Prayer record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedRequest,
        message: "Clergy operational status updated.",
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
