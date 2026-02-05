import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllApplications,
  submitApplication,
  getApplicationById,
  updateApplicationStatus,
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationsByEmployer,
  deleteApplication
} from '../controllers/Application.Controller';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllApplications);
router.post('/', protect, authorize('Applicant'), submitApplication);
router.get('/job/:jobId', protect, authorize('Employer', 'admin'), getApplicationsByJob);
router.get('/user/:userId', protect, getApplicationsByUser);
router.get('/employer/:employerId', protect, authorize('Employer', 'admin'), getApplicationsByEmployer);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('Employer', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deleteApplication);

export default router;
