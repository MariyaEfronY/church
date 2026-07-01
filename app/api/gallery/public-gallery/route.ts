import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GalleryEvent from "@/models/GalleryEvent";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const filterExpired = searchParams.get("expired"); // Optional query: ?expired=true or ?expired=false

    let query: any = {};
    const now = new Date();

    if (filterExpired === "true") {
      // Event date is in the past
      query.eventDate = { $lt: now };
    } else if (filterExpired === "false") {
      // Upcoming events
      query.eventDate = { $gte: now };
    }

    // Sort by most recent calendar date execution order
    const events = await GalleryEvent.find(query).sort({ eventDate: -1 });

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
