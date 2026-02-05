import express from "express";
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

router.get("/", getAllJobs);
router.post("/", addJob);
router.get("/search", searchJobs);
router.get("/employer/:employerId", getJobsByEmployer);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
