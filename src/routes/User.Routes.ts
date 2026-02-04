import express from 'express';
import {
  getAllUsers,
  addUser,
  getUserById,
  updateUser,
  deleteAllUsers,
  deleteUserById
} from '../controllers/User.Controller';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', addUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/', deleteAllUsers);
router.delete('/:id', deleteUserById);

export default router;