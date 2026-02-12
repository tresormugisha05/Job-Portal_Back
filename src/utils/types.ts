import { Request } from "express";

// Extended Request interface for authenticated routes
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    isVerified?: boolean; // Only for employers
  };
}

// You can add other types here as needed
export interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}