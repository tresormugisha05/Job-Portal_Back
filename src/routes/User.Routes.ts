import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  addUser,
  getUserById,
  updateUser,
  deleteUserById,
  loginUser
} from '../controllers/User.Controller';

const router = express.Router();
router.post('/register', addUser);
router.post('/login', loginUser);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUserById);

export default router;