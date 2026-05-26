import mongoose, { Schema, models } from "mongoose";

const BibleVerseSchema = new Schema(
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

const BibleVerse =
  models.BibleVerse || mongoose.model("BibleVerse", BibleVerseSchema);

export default BibleVerse;
