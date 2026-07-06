import mongoose, { Schema, Document, Model } from "mongoose";

interface IAnnouncementImage {
  url: string;
  s3Key: string;
}

export interface IAnnouncement extends Document {
  images: IAnnouncementImage[];
  isActive: boolean;
  createdAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  images: [
    {
      url: { type: String, required: true },
      s3Key: { type: String, required: true },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
