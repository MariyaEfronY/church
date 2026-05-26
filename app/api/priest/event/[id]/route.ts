import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

export async function PUT(req: NextRequest, context: any) {
  try {
    await connectDB();

    const params = await context.params;

    const id = params.id;

    console.log("UPDATE ID:", id);

    const body = await req.json();

    const updatedEvent = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      updatedEvent,
    });
  } catch (error) {
    console.log("PUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    await connectDB();

    const params = await context.params;

    const id = params.id;

    console.log("DELETE ID:", id);

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      { status: 500 },
    );
  }
}
