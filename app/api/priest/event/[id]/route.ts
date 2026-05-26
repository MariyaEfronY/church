import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET SINGLE EVENT
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;

    // 🌟 THE FIX: Cast the Event model to 'any' to bypass uncallable signature union matching
    const event = await (Event as any).findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.log("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 },
    );
  }
}

// UPDATE EVENT
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;

    console.log("UPDATE ID:", id);
    const body = await req.json();

    // 🌟 THE FIX: Cast model to 'any' and options object as well
    const updatedEvent = await (Event as any).findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    } as any);

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

// DELETE EVENT
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;

    console.log("DELETE ID:", id);

    // 🌟 THE FIX: Cast model to 'any'
    const deletedEvent = await (Event as any).findByIdAndDelete(id);

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
