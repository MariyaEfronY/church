import mongoose, { Schema, models, model } from "mongoose";

const EventSchema = new Schema(
  {
    titleEnglish: {
      type: String,
      required: true,
    },

    titleTamil: {
      type: String,
    },

    descriptionEnglish: {
      type: String,
    },

    descriptionTamil: {
      type: String,
    },

    bannerImage: {
      type: String,
      // required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Event = models.Event || model("Event", EventSchema);

export default Event;
