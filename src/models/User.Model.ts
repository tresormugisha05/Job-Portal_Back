import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
export type UserRole = "Employer" | "Applicant";
export interface UserModel extends Document{
  FirstName: string;
  LastName: string;
  Age: string;
  PhoneNumber: string;
  password: string;
  profile?:string
  UserType: UserRole;
  resetPasswordToken?: String;
  resetPasswordExpires?: Date;
  createdAt: Date;
  employerId?: string;
}
const UserSchema = new Schema<UserModel>({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Age: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  profile: { type: String },
  UserType: { type: String, enum: ["Employer", "Applicant"], required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  employerId: { type: String, ref: 'Employer' }
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<UserModel>("User", UserSchema);