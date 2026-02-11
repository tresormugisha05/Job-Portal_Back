import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllEmployers,
  addEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  verifyEmployer,
  getTopHiringCompanies
} from '../controllers/Employer.Controller';

const router = express.Router();

router.get('/', getAllEmployers);
router.get('/top-hiring', getTopHiringCompanies);
router.get('/:id', getEmployerById);
router.post('/', protect, authorize('EMPLOYER'), addEmployer);
router.put('/:id', protect, authorize('EMPLOYER'), updateEmployer);
router.delete('/:id', protect, authorize('ADMIN'), deleteEmployer);
router.patch('/:id/verify', protect, authorize('ADMIN'), verifyEmployer);

export default router;