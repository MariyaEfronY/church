import mongoose, { Schema, Document } from "mongoose";

export interface IGalleryImage {
  url: string; // Direct public S3 access link
  s3Key: string; // Target S3 key path for storage management
}

export interface IGalleryEvent extends Document {
  titleEn: string;
  titleTa: string;
  descriptionEn: string;
  descriptionTa: string;
  category: string; // Chosen keywords: "general" | "feast" | "mass" | "youth"
  eventDate: Date; // Clean, standard Date object format
  images: IGalleryImage[];
  isExpired: boolean;
  createdAt: Date;
}

const GalleryEventSchema: Schema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleTa: { type: String, required: true, trim: true },
    descriptionEn: { type: String, default: "" },
    descriptionTa: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["general", "feast", "mass", "youth"],
      default: "general",
      index: true,
    },
    eventDate: { type: Date, required: true }, // Simple input Date tracking
    images: [
      {
        url: { type: String, required: true },
        s3Key: { type: String, required: true },
      },
    ],
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Pre-save Hook: Auto-computes past/future expiry status
GalleryEventSchema.pre("save", function () {
  if (this.eventDate) {
    const now = new Date();
    this.isExpired = this.eventDate < now;
  }
});

export default mongoose.models.GalleryEvent ||
  mongoose.model<IGalleryEvent>("GalleryEvent", GalleryEventSchema);
