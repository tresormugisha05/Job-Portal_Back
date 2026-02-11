import mongoose, { Schema, Document } from "mongoose";
export interface JobModel {}

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
  company: string; // Added
  requirements: string;
  responsibilities: string;
  category: JobCategory;
  jobType: JobType;
  location: string;
  salary?: string;
  experience?: string; // Added
  education?: string; // Added
  tags?: string[]; // Added
  deadline: Date;
  image:string;
  employerId: string;
  views: number;
  applicationCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<JobModel>({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  company: { type: String, required: true },
  requirements: { type: String, required: true },
  responsibilities: { type: String, required: true },
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
  location: { type: String, required: true },
  salary: { type: String },
  experience: { type: String },
  education: { type: String },
  tags: [{ type: String }],
  deadline: { type: Date, required: true },
  employerId: { type: String, required: true, ref: "Employer" },
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
