import mongoose, { Schema, models } from "mongoose";

const MassTimingSchema = new Schema(
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

const MassTiming =
  models.MassTiming || mongoose.model("MassTiming", MassTimingSchema);

export default MassTiming;
