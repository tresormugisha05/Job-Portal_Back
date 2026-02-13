import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
export interface EmployerModel extends Document {
  companyName: string;
  password: string;
  companySize?: string;
  website?: string;
  description?: string;
  location?: string;
  email: string;
  contactPhone: string;
  logo?: string;
  isVerified: boolean;
  jobsPosted: [Types.ObjectId];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<EmployerModel>(
  {
    companyName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    companySize: { type: String },
    website: { type: String, default: "" },
    description: { type: String, required: false, default: "" },
    location: { type: String, required: false, default: "" },
    email: { type: String, unique: true, required: true },
    contactPhone: { type: String, required: true },
    jobsPosted: { type: [Types.ObjectId], ref: "Job" },
    logo: { type: String, default: "" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // ✅ Automatically handles createdAt & updatedAt
  },
);

EmployerSchema.pre<EmployerModel>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export default mongoose.model<EmployerModel>("Employer", EmployerSchema);