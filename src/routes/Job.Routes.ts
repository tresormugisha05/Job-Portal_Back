import express from "express";
import { protect } from '../middleware/auth.Middleware';
import { authorize } from '../middleware/authorize';
import {
  getAllJobs,
  addJob,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByEmployer,
  searchJobs,
} from "../controllers/Job.Controller";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getAllJobs);
router.get("/search", searchJobs);
router.get("/:id", getJobById);

// Protected routes - authentication required
router.post("/", protect, authorize('Employer'), addJob);
router.get("/employer/:employerId", protect, authorize('Employer', 'admin'), getJobsByEmployer);
router.put("/:id", protect, authorize('Employer'), updateJob);
router.delete("/:id", protect, authorize('Employer', 'admin'), deleteJob);

export default router;