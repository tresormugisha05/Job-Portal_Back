import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/types';

// Simple in-memory token blacklist (for production, use Redis or database)
const tokenBlacklist = new Set<string>();

// Add token to blacklist
export const blacklistToken = (token: string): void => {
  tokenBlacklist.add(token);
  
  // Remove token from blacklist after it expires (7 days)
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, 7 * 24 * 60 * 60 * 1000);
};

// Check if token is blacklisted
export const isTokenBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};

// Middleware to check blacklisted tokens
export const checkBlacklist = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token has been invalidated' });
  }

  next();
};

// Clean up expired tokens periodically
setInterval(() => {
  // In production, implement proper cleanup logic
  console.log(`Token blacklist size: ${tokenBlacklist.size}`);
}, 60 * 60 * 1000); // Check every hour
