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
  console.log('Auth middleware called for:', req.method, req.path);
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('No valid authorization header found');
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided."
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log('Token decoded successfully:', decoded);

    // Determine which collection to query based on role
    if (decoded.role === 'EMPLOYER') {
      // Fetch from Employer collection
      const employer = await Employer.findById(decoded.id).select('-password');

      if (!employer) {
        console.log('Employer not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          error: "Employer account not found",
        });
      }

      if (!employer.isActive) {
        console.log('Employer account is suspended:', decoded.id);
        return res.status(403).json({
          success: false,
          error: "Your account has been suspended. Please contact support.",
        });
      }

      // Attach employer info to request
      req.user = {
        id: employer._id.toString(),
        role: 'EMPLOYER',
        isVerified: employer.isVerified,
      };

      console.log('Employer authenticated:', req.user);
    } else {
      // Fetch from User collection (for CANDIDATE, ADMIN, etc.)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.log('User not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          error: "User account not found",
        });
      }

      if (user.isActive === false) {
        console.log('User account is suspended:', decoded.id);
        return res.status(403).json({
          success: false,
          error: "Your account has been suspended. Please contact support.",
        });
      }

      // Attach user info to request
      req.user = {
        id: user._id.toString(),
        role: user.role,
      };

      console.log('User authenticated:', req.user);
    }

    next();
  } catch (error) {
    console.log('Token verification failed:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "Token has expired. Please login again."
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Please login again."
      });
    }

    res.status(401).json({
      success: false,
      error: "Authentication failed"
    });
  }
};