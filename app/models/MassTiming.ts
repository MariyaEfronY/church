import mongoose, { Schema, models, model, Document } from "mongoose";

// 1. Explicitly map your exact database fields for TypeScript
export interface IMassTiming extends Document {
  titleTamil: string;
  massTypeTamil: "வழக்கமான திருப்பலி" | "சிறப்பு திருப்பலி";
  dayTamil: string;
  massDate?: Date;
  timeTamil: string;
  placeTypeTamil: "பங்கு ஆலயம்" | "கிராம ஆலயம்";
  placeNameTamil: string;
  priestNameTamil?: string;
  descriptionTamil?: string;
  language: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Your exact schema setup with custom validation strings
const MassTimingSchema = new Schema<IMassTiming>(
  {
    titleTamil: {
      type: String,
      required: [true, "திருப்பலி பெயர் அவசியம்"],
    },
    massTypeTamil: {
      type: String,
      enum: ["வழக்கமான திருப்பலி", "சிறப்பு திருப்பலி"],
      default: "வழக்கமான திருப்பலி",
    },
    dayTamil: {
      type: String,
      required: [true, "கிழமை அவசியம்"],
    },
    massDate: {
      type: Date,
    },
    timeTamil: {
      type: String,
      required: [true, "நேரம் அவசியம்"],
    },
    placeTypeTamil: {
      type: String,
      enum: ["பங்கு ஆலயம்", "கிராம ஆலயம்"],
      default: "பங்கு ஆலயம்",
    },
    placeNameTamil: {
      type: String,
      required: [true, "ஆலய பெயர் அவசியம்"],
    },
    priestNameTamil: {
      type: String,
    },
    descriptionTamil: {
      type: String,
    },
    language: {
      type: String,
      default: "தமிழ்",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// 3. 🌟 THE CRITICAL FIX: Cast explicitly to mongoose.Model with the Interface
const MassTiming =
  models.MassTiming || model<IMassTiming>("MassTiming", MassTimingSchema);

export default MassTiming as mongoose.Model<IMassTiming>;
