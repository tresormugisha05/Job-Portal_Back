import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "CANDIDATE" | "ADMIN" | "GUEST";

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
  workExperience: any[];
  educationHistory: any[];
  resume?: string;
  initials?: string;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserModel>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },

    phone: { type: String, required: true },

    password: {
      type: String,
      required: true,
      select: false
    },

    avatar: { type: String },

    role: {
      type: String,
      enum: ["CANDIDATE", "ADMIN", "GUEST"],
      required: true
    },

    professionalTitle: { type: String },
    location: { type: String },
    experience: { type: String },
    education: { type: String },

    skills: { type: [String], default: [] },

    summary: { type: String },

    workExperience: [
      {
        title: String,
        company: String,
        period: String,
        description: String
      }
    ],

    educationHistory: [
      {
        degree: String,
        institution: String,
        year: String
      }
    ],

    resume: { type: String },
    initials: { type: String },

    isActive: { type: Boolean, default: true },

    resetPasswordToken: String,
    resetPasswordExpires: Date,


  },
  { timestamps: true }
);

UserSchema.pre<UserModel>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<UserModel>("User", UserSchema);
