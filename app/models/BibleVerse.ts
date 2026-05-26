import mongoose, { Schema, models, model, Document } from "mongoose";

// 1. Explicitly define the Type interface representing your database fields
export interface IBibleVerse extends Document {
  verseTamil: string;
  referenceTamil: string;
  verseDate: Date;
  isTodayVerse: boolean;
  language: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create your Schema structure passing the Interface type
const BibleVerseSchema = new Schema<IBibleVerse>(
  {
    verseTamil: {
      type: String,
      required: [true, "இறைவசனம் அவசியம்"],
    },
    referenceTamil: {
      type: String,
      required: [true, "இறைவசன குறிப்பு அவசியம்"],
    },
    verseDate: {
      type: Date,
      required: [true, "தேதி அவசியம்"],
    },
    isTodayVerse: {
      type: Boolean,
      default: false,
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

// 3. 🌟 THE CRITICAL FIX: Safe structural initialization for production environments
const BibleVerse =
  models.BibleVerse || model<IBibleVerse>("BibleVerse", BibleVerseSchema);

export default BibleVerse as mongoose.Model<IBibleVerse>;
