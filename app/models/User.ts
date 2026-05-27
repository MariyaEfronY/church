import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Explicitly outline your entity type structure contract
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Map the structural types inside your Mongoose Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["priest", "admin", "staff", "student"],
      default: "student",
    },
  },
  { timestamps: true },
);

// 3. Clear cached models during hot-reloads to prevent overwrite model compilation flags
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
