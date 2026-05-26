import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import BibleVerse from "../../../../models/BibleVerse";

// GET SINGLE VERSE
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // 🌟 Clean and fully callable now that the model types match perfectly!
    const verse = await BibleVerse.findById(id);

    return NextResponse.json({
      success: true,
      data: verse,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "இறைவசனம் கிடைக்கவில்லை",
      },
      { status: 500 },
    );
  }
}

// UPDATE VERSE
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    // 🌟 Clean and type-safe updates
    const updatedVerse = await BibleVerse.findByIdAndUpdate(id, body, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      message: "இறைவசனம் புதுப்பிக்கப்பட்டது",
      data: updatedVerse,
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

// DELETE VERSE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // 🌟 Clean deletion mapping
    await BibleVerse.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "இறைவசனம் நீக்கப்பட்டது",
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
