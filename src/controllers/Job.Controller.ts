import { Request, Response } from 'express';
import Job from '../models/Job.Model';
import Employer from '../models/Employer.Model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - logo
 *         - description
 *         - company
 *         - requirements
 *         - responsibilities
 *         - category
 *         - jobType
 *         - type
 *         - typeBg
 *         - location
 *         - deadline
 *         - employerId
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         logo:
 *           type: string
 *         logoBg:
 *           type: string
 *         description:
 *           type: string
 *         company:
 *           type: string
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         jobType:
 *           type: string
 *         type:
 *           type: string
 *         typeBg:
 *           type: string
 *         location:
 *           type: string
 *         salary:
 *           type: string
 *         experience:
 *           type: string
 *         education:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         deadline:
 *           type: string
 *           format: date
 *         employerId:
 *           type: string
 *         featured:
 *           type: boolean
 *         views:
 *           type: number
 *         applicationCount:
 *           type: number
 *         isActive:
 *           type: boolean
 */

/* GET all jobs */
export const getAllJobs = async (_: Request, res: Response) => {
  try {
    const jobs = await Job.find({ isActive: true }).populate('employerId');
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/* POST new job */
export const addJob = async (req: Request, res: Response) => {
  try {
    const {
      title,
      logo,
      logoBg,
      description,
      company,
      requirements,
      responsibilities,
      category,
      jobType,
      type,
      typeBg,
      location,
      salary,
      experience,
      education,
      tags,
      deadline,
      employerId,
      featured,
    } = req.body;

    if (!title || !logo || !description || !requirements || !responsibilities || !category || !jobType || !type || !typeBg || !location || !deadline || !employerId) {
      return res.status(400).json({ success: false, message: "all required fields are needed" });
    }

    const employer = await Employer.findOne({ _id: employerId });
    if (!employer || !employer.isVerified) {
      return res.status(403).json({ success: false, message: "Your employer profile must be verified by an admin before you can post jobs." });
    }

    const newJob = await Job.create({
      title,
      logo,
      logoBg,
      description,
      company,
      requirements,
      responsibilities,
      category,
      jobType,
      type,
      typeBg,
      location,
      salary,
      experience,
      education,
      tags,
      deadline,
      employerId,
      featured,
    });

    res.status(201).json({ success: true, message: 'Job created successfully', data: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/* GET job by ID */
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId');
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    job.views += 1;
    await job.save();

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/* PUT update job */
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('employerId');
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, message: "Job updated successfully", data: job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/* DELETE job */
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/* GET jobs by employer */
export const getJobsByEmployer = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/* SEARCH jobs */
export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { keyword, category, location, jobType, experience, education } = req.query;
    let query: any = { isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experience) query.experience = experience;
    if (education) query.education = education;

    const jobs = await Job.find(query).populate('employerId');
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/* PATCH toggle job status */
export const toggleJobStatus = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({ success: true, message: `Job ${job.isActive ? "activated" : "suspended"} successfully`, data: { isActive: job.isActive } });
  } catch (error) {
    console.error("Error toggling job status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
