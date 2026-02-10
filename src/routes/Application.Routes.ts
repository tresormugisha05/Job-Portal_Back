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

router.get('/', protect, authorize('ADMIN'), getAllApplications);
router.post('/:jobId', protect, authorize('CANDIDATE'),
  documentUpload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  submitApplication
);
router.get('/job/:jobId', protect, authorize('EMPLOYER', 'ADMIN'), getApplicationsByJob);
router.get('/user/:userId', protect, getApplicationsByUser);
router.get('/employer/:employerId', protect, authorize('EMPLOYER', 'ADMIN'), getApplicationsByEmployer);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('EMPLOYER', 'ADMIN'), updateApplicationStatus);
router.delete('/:id', protect, authorize('ADMIN'), deleteApplication);

export default router;
