import mongoose, { Schema, Document } from "mongoose";

// Job categories & types
export type JobCategory =
  | "Technology"
  | "Healthcare"
  | "Finance"
  | "Education"
  | "Marketing"
  | "Sales"
  | "Engineering"
  | "Other";

export type JobType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Remote";

// Job interface
export interface JobModel extends Document {
  title: string;
  description: string;
  company: string;           // Integration field
  requirements: string[];
  responsibilities: string[];
  category: string;
  jobType: JobType;          // For backend logic
  type: string;              // Frontend display
  typeBg: string;            // Frontend color class
  location: string;
  salary?: string;
  experience?: string;
  education?: string;
  tags?: string[];
  deadline: Date;
  logo: string;              // Master field
  logoBg?: string;           // Optional frontend color class
  image?: string;            // Integration field
  employerId: string;
  featured: boolean;
  views: number;
  applicationCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Job schema
const JobSchema = new Schema<JobModel>({
  title: { type: String, required: true },
  logo: { type: String, required: true },
  logoBg: { type: String, default: "bg-blue-100 text-blue-600" },
  image: { type: String },                      // Integration
  description: { type: String, required: true },
  company: { type: String, required: true },   // Integration
  requirements: { type: [String], default: [] },
  responsibilities: { type: [String], default: [] },
  category: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time","Part-time","Contract","Internship","Remote"],
    required: true,
  },
  type: { type: String, required: true },     // Frontend
  typeBg: { type: String, required: true },   // Frontend
  location: { type: String, required: true },
  salary: { type: String },
  experience: { type: String },
  education: { type: String },
  tags: { type: [String], default: [] },
  deadline: { type: Date, required: true },
  employerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt before save
JobSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export default mongoose.model<JobModel>("Job", JobSchema);
