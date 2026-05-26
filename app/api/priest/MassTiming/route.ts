import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import MassTiming from "../../../models/MassTiming";

// GET ALL MASS
export async function GET() {
  try {
    await connectDB();

    const masses = await MassTiming.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: masses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "திருப்பலி தகவல் பெற முடியவில்லை",
      },
      { status: 500 },
    );
  }
}

// CREATE MASS
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const mass = await MassTiming.create(body);

    return NextResponse.json({
      success: true,
      message: "திருப்பலி சேர்க்கப்பட்டது",
      data: mass,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "திருப்பலி சேர்க்க முடியவில்லை",
      },
      { status: 500 },
    );
  }
}
