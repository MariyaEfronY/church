import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import BibleVerse from "@/models/BibleVerse";

// GET ALL VERSES
export async function GET() {
  try {
    await connectDB();

    const verses = await BibleVerse.find().sort({
      verseDate: -1,
    });

    return NextResponse.json({
      success: true,
      data: verses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "இறைவசனம் பெற முடியவில்லை",
      },
      { status: 500 },
    );
  }
}

// CREATE VERSE
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const verse = await BibleVerse.create(body);

    return NextResponse.json({
      success: true,
      message: "இறைவசனம் சேர்க்கப்பட்டது",
      data: verse,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "இறைவசனம் சேர்க்க முடியவில்லை",
      },
      { status: 500 },
    );
  }
}
