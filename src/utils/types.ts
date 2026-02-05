import { Request } from "express";
export interface AuthRequest extends Request {
  user?: {
    username: string;
    id: string;
    role: string;
  };
}