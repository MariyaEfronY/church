import mongoose, { Schema, models, model } from "mongoose";

const PriestSchema = new Schema(
  {
    nameEnglish: {
      type: String,
      required: true,
    },

    nameTamil: {
      type: String,
    },

    role: {
      type: String,
      default: "Priest",
    },
  },
  { _id: false },
);

const MassTimingSchema = new Schema(
  {
    dayEnglish: {
      type: String,
      required: true,
    },

    dayTamil: {
      type: String,
    },

    timing: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      enum: ["Tamil", "English", "Both"],
      default: "Tamil",
    },

    specialMass: {
      type: Boolean,
      default: false,
    },

    priests: [PriestSchema],

    notesEnglish: {
      type: String,
    },

    notesTamil: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const MassTiming = models.MassTiming || model("MassTiming", MassTimingSchema);

export default MassTiming;
