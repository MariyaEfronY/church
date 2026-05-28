import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrayerRequest extends Document {
  intention: string;
  lang: "en" | "ta";
  paymentStatus: "None" | "Pending" | "Paid";
  amountPaid?: number;
  paymentIntentId?: string;
  // 🏛️ New Clergy Status Matrix Additions
  priestStatus: "Pending" | "Accepted" | "Completed" | "Rejected";
  reviewedAt?: Date;
  createdAt: Date;
}

const PrayerRequestSchema: Schema<IPrayerRequest> = new Schema(
  {
    intention: {
      type: String,
      required: [true, "Prayer intention text is required"],
    },
    lang: {
      type: String,
      enum: ["en", "ta"],
      required: true,
      default: "en",
    },
    paymentStatus: {
      type: String,
      enum: ["None", "Pending", "Paid"],
      default: "None",
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    // 🏛️ Modified Priest Status Fields
    priestStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Rejected"],
      default: "Pending", // Automatically sets as "Pending" upon initial creation
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const PrayerRequest: Model<IPrayerRequest> =
  mongoose.models.PrayerRequest ||
  mongoose.model<IPrayerRequest>("PrayerRequest", PrayerRequestSchema);

export default PrayerRequest;
