import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllEmployers,
  registerEmployer,
  loginEmployer,
  addEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  verifyEmployer,
  getTopHiringCompanies
} from '../controllers/Employer.Controller';

const router = express.Router();

// Public routes
router.post('/register', registerEmployer);
router.post('/login', loginEmployer);

// Public route: get all employers
router.get('/', getAllEmployers);
router.get('/all', getAllEmployers);
router.get('/top-hiring', getTopHiringCompanies);
router.get('/:id', getEmployerById);

// Create employer profile (Admin only now, since public registration is handled via /register)
router.post('/', protect, authorize('ADMIN'), addEmployer);

// Update employer profile
// Only the EMPLOYER who owns the profile can update it (ownership checked in controller)
// Admins can update any profile
router.put('/:id', protect, authorize('EMPLOYER'), updateEmployer);

// Delete employer profile (ADMIN only)
router.delete('/:id', protect, authorize('ADMIN'), deleteEmployer);

// Verify/unverify employer (ADMIN only)
router.patch('/:id/verify', verifyEmployer);

export default router;