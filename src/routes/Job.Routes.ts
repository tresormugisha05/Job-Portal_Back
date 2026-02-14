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
  searchJobs
} from "../controllers/Job.Controller";

const router = express.Router();

// Public routes - no authentication required
router.get("/all", getAllJobs);
router.get("/search", searchJobs);

// Protected routes - authentication required
router.post("/", protect, authorize('EMPLOYER'), addJob);
router.get("/employer/:employerId", getJobsByEmployer);
router.get("/:id", getJobById);
router.put("/:id", protect, authorize('EMPLOYER'), updateJob);
router.delete("/:id", protect, authorize('EMPLOYER', 'ADMIN'), deleteJob);

export default router;