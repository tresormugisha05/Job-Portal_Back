import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import { documentUpload } from '../middleware/documentUpload.middleware';
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
router.post('/:jobId', protect, authorize('Applicant'), 
  documentUpload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]), 
  submitApplication
);
router.get('/job/:jobId', protect, authorize('Employer', 'admin'), getApplicationsByJob);
router.get('/user/:userId', protect, getApplicationsByUser);
router.get('/employer/:employerId', protect, authorize('Employer', 'admin'), getApplicationsByEmployer);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('Employer', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deleteApplication);

export default router;
