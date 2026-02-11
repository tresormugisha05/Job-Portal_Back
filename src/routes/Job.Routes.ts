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
  toggleJobStatus
} from "../controllers/Job.Controller";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getAllJobs);
router.get("/search", searchJobs);
router.get("/:id", getJobById);

// Protected routes - authentication required
router.post("/", protect, authorize('EMPLOYER'), addJob);
router.get("/employer/:employerId", protect, authorize('EMPLOYER', 'ADMIN'), getJobsByEmployer);
router.put("/:id", protect, authorize('EMPLOYER'), updateJob);
router.delete("/:id", protect, authorize('EMPLOYER', 'ADMIN'), deleteJob);
router.patch("/:id/status", protect, authorize('ADMIN'), toggleJobStatus);

export default router;