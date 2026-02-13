import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../utils/types";
import Employer from "../models/Employer.Model";
import User from "../models/User.Model";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.userType === "employer") {
      req.user = (await Employer.findById(decoded.id).select("-password")) as any;
      if (req.user) {
        req.user.role = "EMPLOYER"; // Standardize role for frontend
      }
    } else {
      req.user = (await User.findById(decoded.id).select("-password")) as any;
    }

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};