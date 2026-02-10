import mongoose, { Schema, Document } from "mongoose";
export interface JobModel { }

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

export interface JobModel extends Document {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: JobCategory;
  jobType: JobType; // Keep for backend logic if needed
  type: string;    // Frontend display (e.g., "Full-time")
  typeBg: string;  // Frontend color class
  location: string;
  salary?: string;
  deadline: Date;
  logo: string;
  logoBg?: string; // Frontend color class
  employerId: string;
  experience?: string;
  education?: string;
  featured: boolean;
  views: number;
  applicationCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<JobModel>({
  title: { type: String, required: true },
  logo: { type: String, required: true },
  logoBg: { type: String, default: "bg-blue-100 text-blue-600" },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
  responsibilities: { type: [String], default: [] },
  category: {
    type: String,
    enum: [
      "Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Marketing",
      "Sales",
      "Engineering",
      "Other",
    ],
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
    required: true,
  },
  type: { type: String, required: true },
  typeBg: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  deadline: { type: Date, required: true },
  employerId: { type: String, required: true, ref: "Employer" },
  experience: { type: String },
  education: { type: String },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

JobSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export default mongoose.model<JobModel>("Job", JobSchema);
