import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PrayerRequest from "@/models/PrayerRequest";

export async function POST(req: Request) {
  try {
    await connectDB();
    const {
      intention,
      candidateNames,
      deliveredAt,
      lang,
      paymentStatus,
      amountPaid,
      paymentIntentId,
    } = await req.json();

    // Process candidate names array (filter out empty inputs if submitted from multi-input UI fields)
    const sanitizedCandidates = Array.isArray(candidateNames)
      ? candidateNames
          .map((name: string) => name.trim())
          .filter((name: string) => name !== "")
      : [];

    // Persist records to MongoDB matching the unrequired schema structure
    const newRequest = await PrayerRequest.create({
      intention: intention ? intention.trim() : "",
      candidateNames: sanitizedCandidates,
      deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
      lang: lang || "en",
      paymentStatus: paymentStatus || "None",
      amountPaid: amountPaid || 0,
      paymentIntentId: paymentIntentId || null,
      priestStatus: "Pending", // Explicit initial state fallback
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
