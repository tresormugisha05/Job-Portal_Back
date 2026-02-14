import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface EmployerModel extends Document {
  // Authentication fields
  // name removed
  email: string;
  password: string;
  phone: string;

  // Company fields
  companyName: string;
  industry?: string;
  companySize?: string;
  website?: string;
  description?: string;
  location?: string;
  // contactPhone removed
  logo?: string;

  // Status fields
  isVerified: boolean;
  jobsPosted: [mongoose.Types.ObjectId];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<EmployerModel>(
  {
    // Authentication fields
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },

    // Company fields
    companyName: { type: String, required: true },
    industry: { type: String },
    companySize: { type: String },
    website: { type: String },
    description: { type: String },
    location: { type: String },
    logo: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
EmployerSchema.pre<EmployerModel>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export default mongoose.model<EmployerModel>("Employer", EmployerSchema);