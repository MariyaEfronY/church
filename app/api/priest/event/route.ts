import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Event from "../../../models/Event";

export async function GET() {
  try {
    await connectDB();

    const event = await Event.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const newEvent = await Event.create(body);

    return NextResponse.json({
      success: true,
      newEvent,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create event",
      },
      { status: 500 },
    );
  }
}
