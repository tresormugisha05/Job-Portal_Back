import { Request, Response } from 'express';
import User from '../models/User.Model';
import { AuthRequest } from '../utils/types';

export const uploadProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const profileUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: profileUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profileUrl: user.avatar
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};