import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../utils/types";
import dotenv from "dotenv";
dotenv.config();

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log('Auth middleware called for:', req.method, req.path);
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('No valid authorization header found');
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('Token decoded successfully:', decoded);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    res.status(401).json({ error: "Invalid token" });
  }
};
