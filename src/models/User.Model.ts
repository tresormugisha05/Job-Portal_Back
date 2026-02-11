import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
export type UserRole = "CANDIDATE" | "EMPLOYER" | "ADMIN" | "GUEST";

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationHistory {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface UserModel extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  role: UserRole;
  professionalTitle?: string;
  location?: string;
  experience?: string;
  education?: string;
  skills: string[];
  summary?: string;
  workExperience: WorkExperience[];
  educationHistory: EducationHistory[];
  resume?: string;
  initials?: string;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  employerId?: string;
}

const UserSchema = new Schema<UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: {
    type: String,
    enum: ["CANDIDATE", "EMPLOYER", "ADMIN", "GUEST"],
    required: true
  },
  professionalTitle: { type: String },
  location: { type: String },
  experience: { type: String },
  education: { type: String },
  skills: { type: [String], default: [] },
  summary: { type: String },
  workExperience: [{
    id: { type: String },
    title: { type: String },
    company: { type: String },
    period: { type: String },
    description: { type: String }
  }],
  educationHistory: [{
    id: { type: String },
    degree: { type: String },
    institution: { type: String },
    year: { type: String }
  }],
  resume: { type: String },
  initials: { type: String },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  employerId: { type: String, ref: 'Employer' }
});

UserSchema.pre<UserModel>("save", async function (this: UserModel) {
  this.updatedAt = new Date();
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<UserModel>("User", UserSchema);
