import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrayerRequest extends Document {
  // Now completely optional text field
  intention?: string;
  // Captures target candidate names to pray for as an array of strings
  candidateNames: string[];
  lang: "en" | "ta";
  paymentStatus: "None" | "Pending" | "Paid";
  amountPaid?: number;
  paymentIntentId?: string;
  // 🏛️ Expanded Operational Clergy States
  priestStatus: "Pending" | "Accepted" | "Prayed" | "Rejected";
  // The timestamp when the request was reviewed/interacted with by the clergy
  reviewedAt?: Date;
  // The targeted delivery/celebration date timestamp for the requested intention
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrayerRequestSchema: Schema<IPrayerRequest> = new Schema(
  {
    intention: {
      type: String,
      required: false, // Explicitly marked not required
      default: "",
    },
    candidateNames: {
      type: [String], // Array of strings configuration matrix
      required: false, // Explicitly marked not required
      default: [], // Defaults to an empty array tree if none provided
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
      required: true,
      default: "None",
    },
    amountPaid: {
      type: Number,
      required: false,
      default: 0,
    },
    paymentIntentId: {
      type: String,
      required: false,
      default: null,
    },
    priestStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Prayed", "Rejected"], // Updated with your new "Prayed" status matrix
      required: true,
      default: "Pending",
    },
    reviewedAt: {
      type: Date,
      required: false, // Explicitly marked not required
      default: null,
    },
    deliveredAt: {
      type: Date,
      required: false, // Explicitly marked not required
      default: null,
    },
  },
  {
    timestamps: true, // Automatically tracks and manages "createdAt" and "updatedAt" records
  },
);

const PrayerRequest: Model<IPrayerRequest> =
  mongoose.models.PrayerRequest ||
  mongoose.model<IPrayerRequest>("PrayerRequest", PrayerRequestSchema);

export default PrayerRequest;
