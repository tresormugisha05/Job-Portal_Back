import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { transporter } from '../config/Email';
import User from '../models/User.Model';
import { JWTPayload } from '../utils/auth.Types';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
  // Generate JWT Token
  static generateJWTToken(user: any): string {
    const payload: JWTPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions);
  }

  // Hash Password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare Password
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate Reset Token
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send Reset Email
  static async sendResetEmail(email: string, token: string): Promise<void> {
    if (!transporter) {
      console.log('Email service not available');
      return;
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  // Send Welcome Email
  static async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    if (!transporter) {
      console.log('Email service not available');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Job Portal',
      html: `
        <h2>Welcome to Job Portal!</h2>
        <p>Hello ${firstName},</p>
        <p>Thank you for registering on our Job Portal. Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse job listings</li>
          <li>Apply for positions</li>
          <li>Manage your profile</li>
        </ul>
        <p>We're excited to have you join our community!</p>
        <p>Best regards,<br>Job Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  // Verify JWT Token
  static verifyJWTToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  // Find User by Email
  static async findUserByEmail(email: string) {
    return User.findOne({ email });
  }

  // Find User by Reset Token
  static async findUserByResetToken(token: string) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }
}
