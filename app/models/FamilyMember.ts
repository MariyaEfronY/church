import mongoose, { Schema, Document } from "mongoose";

export interface IFamilyMember extends Document {
  familyHeadId: mongoose.Types.ObjectId;
  name: string;
  relationship: "Wife" | "Husband" | "Children" | "Others";
  age: number;
  bloodGroup: string;
}

const FamilyMemberSchema: Schema = new Schema(
  {
    familyHeadId: {
      type: Schema.Types.ObjectId,
      ref: "FamilyHead",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    relationship: {
      type: String,
      enum: ["Wife", "Husband", "Children", "Others"],
      required: true,
    },
    age: { type: Number, required: true },
    bloodGroup: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.FamilyMember ||
  mongoose.model<IFamilyMember>("FamilyMember", FamilyMemberSchema);
