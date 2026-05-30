import mongoose, { Schema, Document } from "mongoose";

export interface IFamilyHead extends Document {
  name: string;
  age?: number;
  phone: string;
  email?: string;
  village: string;
  address: string;
  anbiyam: string;
  password?: string;
  bloodGroup?: string;
  role: string;
  createdAt: Date;
}

const FamilyHeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, trim: true }, // sparse allows multiple null/undefined values
    village: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    anbiyam: { type: String, required: true, trim: true },
    password: { type: String, required: true }, // Handled during login encryption
    bloodGroup: { type: String, trim: true }, // Hydrated during data initialization
    role: { type: String, default: "family_head" },
  },
  { timestamps: true },
);

export default mongoose.models.FamilyHead ||
  mongoose.model<IFamilyHead>("FamilyHead", FamilyHeadSchema);
