import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.Controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication operations
 */

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', protect, logoutUser);
router.post('/change-password', protect, changePassword);

export default router;
