import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import MassTiming from "../../../../models/MassTiming";

// GET SINGLE MASS
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // 🌟 Now cleanly callable because the model type is explicitly declared above!
    const mass = await MassTiming.findById(id);

    return NextResponse.json({
      success: true,
      data: mass,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "திருப்பலி கிடைக்கவில்லை",
      },
      { status: 500 },
    );
  }
}

// UPDATE MASS
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const updatedMass = await MassTiming.findByIdAndUpdate(id, body, {
      new: true, // Returns the freshly updated document cleanly
    });

    return NextResponse.json({
      success: true,
      message: "திருப்பலி புதுப்பிக்கப்பட்டது",
      data: updatedMass,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "புதுப்பிக்க முடியவில்லை",
      },
      { status: 500 },
    );
  }
}

// DELETE MASS
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await MassTiming.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "திருப்பலி நீக்கப்பட்டது",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "நீக்க முடியவில்லை",
      },
      { status: 500 },
    );
  }
}
