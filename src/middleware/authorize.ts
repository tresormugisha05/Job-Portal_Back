import { Response, NextFunction } from "express";
import { AuthRequest } from "../utils/types";

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Access denied. No user found." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions."
      });
    }
    next();
  };
};