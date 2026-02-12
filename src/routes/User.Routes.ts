import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import { profileUpload } from '../middleware/profileUpload.middleware';
import {
  addUser,
  getUserById,
  updateUser,
  deleteUserById,
  loginUser,
  logoutUser,
  changePassword,
  toggleUserStatus
} from '../controllers/User.Controller';

const router = express.Router();

// Register: includes profile picture upload
router.post('/register', profileUpload.single('profile'), addUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', protect, logoutUser);

// Change password
router.post('/change-password', protect, changePassword);

// Get user by ID
router.get('/:id', protect, getUserById);

// Update user
router.put('/:id', protect, updateUser);

// Delete user (admin only)
router.delete('/:id', protect, authorize('ADMIN'), deleteUserById);

// Toggle user status (admin only)
router.patch('/:id/status', protect, authorize('ADMIN'), toggleUserStatus);

export default router;