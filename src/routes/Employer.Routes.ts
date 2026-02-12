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

// Public route: get all employers
router.get('/', getAllEmployers);
router.get('/top-hiring', getTopHiringCompanies);
router.get('/:id', getEmployerById);

// Create employer profile (only EMPLOYER role, user cannot have multiple profiles)
router.post('/', protect, authorize('EMPLOYER'), addEmployer);

// Update employer profile
// Only the EMPLOYER who owns the profile can update it (ownership checked in controller)
// Admins can update any profile
router.put('/:id', protect, authorize('EMPLOYER'), updateEmployer);

// Delete employer profile (ADMIN only)
router.delete('/:id', protect, authorize('ADMIN'), deleteEmployer);

// Verify/unverify employer (ADMIN only)
router.patch('/:id/verify', protect, authorize('ADMIN'), verifyEmployer);

export default router;