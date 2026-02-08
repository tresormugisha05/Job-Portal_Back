import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllEmployers,
  addEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer
} from '../controllers/Employer.Controller';

const router = express.Router();

router.get('/', getAllEmployers);
router.get('/:id', getEmployerById);
router.post('/', protect, authorize('Employer'), addEmployer);
router.put('/:id', protect, authorize('Employer'), updateEmployer);
router.delete('/:id', protect, authorize('admin'), deleteEmployer);

export default router;