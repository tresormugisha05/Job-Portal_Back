import mongoose, { Schema, Document, Types } from "mongoose";

export interface EmployerModel extends Document {
  companyName: string;
  industry: string;
  companySize: string;
  website?: string;
  description: string;
  location: string;
  email: string;
  contactPhone: string;
  logo?: string;
  isVerified: boolean;
  isActive: boolean;
  userId: Types.ObjectId; // ✅ Use ObjectId
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<EmployerModel>(
  {
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    companySize: { type: String, required: true },
    website: { type: String },
    description: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    contactPhone: { type: String, required: true },
    logo: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // ✅ Proper reference to User
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ensures one employer profile per user
    },
  },
  {
    timestamps: true, // ✅ Automatically handles createdAt & updatedAt
  }
);

export default mongoose.model<EmployerModel>("Employer", EmployerSchema);