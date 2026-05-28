import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Parse out optional filter variables from the incoming URL query string
    const { searchParams } = new URL(req.url);
    const deliveredDateParam = searchParams.get("deliveredAt"); // Format: YYYY-MM-DD
    const reviewedDateParam = searchParams.get("reviewedAt"); // Format: YYYY-MM-DD
    const priestStatusParam = searchParams.get("priestStatus"); // Filter directly by status state if wanted

    // Initialize an empty query criteria object
    const queryConditions: any = {};

    // 📅 Filter by exact calendar day or date range boundaries for Delivered Date
    if (deliveredDateParam) {
      const startOfDay = new Date(deliveredDateParam);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(deliveredDateParam);
      endOfDay.setHours(23, 5, 59, 999);

      queryConditions.deliveredAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // 🏛️ Filter by exact calendar day boundaries for Clergy Review Date
    if (reviewedDateParam) {
      const startOfDay = new Date(reviewedDateParam);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(reviewedDateParam);
      endOfDay.setHours(23, 59, 59, 999);

      queryConditions.reviewedAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Optional status matrix tracking filters
    if (priestStatusParam) {
      queryConditions.priestStatus = priestStatusParam;
    }

    // 🔄 Fetch records: Last In, First Out sorting structure ($sort by createdAt newest first)
    const requests = await PrayerRequest.find(queryConditions).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      { success: true, count: requests.length, data: requests },
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

    // 🤝 Validated against your absolute newest structural state pipeline rules
    if (!["Pending", "Accepted", "Prayed", "Rejected"].includes(priestStatus)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid priest status classification assignment matching template options",
        },
        { status: 400 },
      );
    }

    // Alter priestStatus and stamp the execution time context parameter automatically
    const updatedRequest = await PrayerRequest.findByIdAndUpdate(
      id,
      {
        priestStatus: priestStatus,
        reviewedAt: new Date(), // Tracks down exact operational confirmation timestamp
      },
      { new: true, runValidators: true },
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, message: "Prayer record context missing or deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedRequest,
        message: "Clergy dynamic workflow status synchronized successfully.",
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
