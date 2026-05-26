import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import BibleVerse from "../../../../models/BibleVerse";

// GET SINGLE VERSE
export async function GET(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;

    const verse = await BibleVerse.findById(id);

    return NextResponse.json({
      success: true,
      data: verse,
    });
  } catch (error) {
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
export async function PUT(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await req.json();

    const updatedVerse = await BibleVerse.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });

    return NextResponse.json({
      success: true,
      message: "இறைவசனம் புதுப்பிக்கப்பட்டது",
      data: updatedVerse,
    });
  } catch (error) {
    console.log(error);

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
export async function DELETE(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;

    await BibleVerse.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "இறைவசனம் நீக்கப்பட்டது",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "நீக்க முடியவில்லை",
      },
      { status: 500 },
    );
  }
}
