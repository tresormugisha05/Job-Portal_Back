import mongoose, { Schema, Document } from "mongoose";

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
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<EmployerModel>({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  companySize: { type: String, required: true },
  website: { type: String },
  description: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactPhone: { type: String, required: true },
  logo: { type: String },
  isVerified: { type: Boolean, default: false },
  userId: { type: String, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

EmployerSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export default mongoose.model<EmployerModel>("Employer", EmployerSchema);
