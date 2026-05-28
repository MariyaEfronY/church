import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { intention, lang, paymentStatus, amountPaid, paymentIntentId } =
      await req.json();

    if (!intention || intention.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message:
            lang === "ta"
              ? "ஜெப விண்ணப்ப உரை தேவை."
              : "Prayer intention text is required.",
        },
        { status: 400 },
      );
    }

    // Persist records to MongoDB with optional payment variables
    const newRequest = await PrayerRequest.create({
      intention: intention.trim(),
      lang: lang || "en",
      paymentStatus: paymentStatus || "None",
      amountPaid: amountPaid || 0,
      paymentIntentId: paymentIntentId || null,
    });

    return NextResponse.json(
      {
        success: true,
        data: newRequest,
        message:
          lang === "ta"
            ? "உங்கள் ஜெப விண்ணப்பம் பாதுகாப்பாக சமர்ப்பிக்கப்பட்டது."
            : "Your prayer request has been securely submitted.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Prayer Request Endpoint Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
