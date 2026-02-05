import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteAllUsers,
  deleteUserById
} from '../controllers/User.Controller';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/', addUser);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/', protect, authorize('admin'), deleteAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUserById);
export default router;