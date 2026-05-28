import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivity extends Document {
  title: string;
  description: string;
  location: string;
  s3Url: string;
  s3Key: string;
  activityDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    s3Url: { type: String, required: true },
    s3Key: { type: String, required: true },
    activityDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default Activity;
