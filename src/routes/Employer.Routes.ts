import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllEmployers,
  addEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  getEmployerByUserId,
  verifyEmployer
} from '../controllers/Employer.Controller';

const router = express.Router();
router.get('/', getAllEmployers);
router.get('/:id', getEmployerById);
router.post('/', protect, authorize('Employer'), addEmployer);
router.get('/user/:userId', protect, getEmployerByUserId);
router.put('/:id', protect, authorize('Employer'), updateEmployer);
router.put('/:id/verify', protect, authorize('admin'), verifyEmployer);
router.delete('/:id', protect, authorize('admin'), deleteEmployer);

export default router;