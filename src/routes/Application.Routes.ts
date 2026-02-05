import express from 'express';
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

router.get('/', getAllApplications);
router.post('/', submitApplication);
router.get('/job/:jobId', getApplicationsByJob);
router.get('/user/:userId', getApplicationsByUser);
router.get('/employer/:employerId', getApplicationsByEmployer);
router.get('/:id', getApplicationById);
router.put('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;
