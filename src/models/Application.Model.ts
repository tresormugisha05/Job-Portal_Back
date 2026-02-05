import mongoose, { Schema, Document } from "mongoose";

export type ApplicationStatus = "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";

export interface ApplicationModel extends Document {
  jobId: string;
  userId: string;
  employerId: string;
  resume: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  submissionDate: Date;
  lastUpdated: Date;
}

const ApplicationSchema = new Schema<ApplicationModel>({
  jobId: { type: String, required: true, ref: 'Job' },
  userId: { type: String, required: true, ref: 'User' },
  employerId: { type: String, required: true, ref: 'Employer' },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "reviewed", "shortlisted", "rejected", "hired"], 
    default: "pending" 
  },
  notes: { type: String },
  submissionDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

ApplicationSchema.pre("save", function () {
  this.lastUpdated = new Date();
});

export default mongoose.model<ApplicationModel>("Application", ApplicationSchema);
