import express from 'express';
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllUsers,
  getAllEmployers,
  getAllJobs,
  getAllApplications,
  deleteUser,
  deleteEmployer,
  deleteApplication,
  getStats
} from '../controllers/adminController';

const router = express.Router();
router.use(protect);
router.use(authorize('ADMIN'));
router.get('/users', getAllUsers);
router.get('/employers', getAllEmployers);
router.get('/jobs', getAllJobs);
router.get('/applications', getAllApplications);
router.delete('/users/:id', deleteUser);
router.delete('/employers/:id', deleteEmployer);
router.delete('/applications/:id', deleteApplication);
router.get('/stats', getStats);

export default router;