import mongoose, { Schema, models, model } from "mongoose";

const VerseSchema = new Schema(
  {
    verseEnglish: {
      type: String,
      required: true,
    },

    verseTamil: {
      type: String,
    },

    reference: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    isTodayVerse: {
      type: Boolean,
      default: true,
    },

    addedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Verse = models.Verse || model("Verse", VerseSchema);

export default Verse;
