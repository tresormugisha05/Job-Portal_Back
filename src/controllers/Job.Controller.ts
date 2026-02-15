import { Request, Response } from "express";
import Job from "../models/Job.Model";
import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - company
 *         - requirements
 *         - responsibilities
 *         - category
 *         - jobType
 *         - location
 *         - deadline
 *         - employerId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the job
 *         title:
 *           type: string
 *           description: The job title
 *         description:
 *           type: string
 *           description: The job description
 *         company:
 *           type: string
 *           description: The name of the company posting the job
 *         requirements:
 *           type: string
 *           description: Job requirements
 *         responsibilities:
 *           type: string
 *           description: Job responsibilities
 *         category:
 *           type: string
 *           enum: [Technology, Healthcare, Finance, Education, Marketing, Sales, Engineering, Other]
 *           description: Job category
 *         jobType:
 *           type: string
 *           enum: [Full-time, Part-time, Contract, Internship, Remote]
 *           description: Type of employment
 *         location:
 *           type: string
 *           description: Job location
 *         salary:
 *           type: string
 *           description: Salary range
 *         experience:
 *           type: string
 *           description: Required years of experience
 *         education:
 *           type: string
 *           description: Required educational background
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Keywords or skills related to the job
 *         deadline:
 *           type: string
 *           format: date
 *           description: Application deadline
 *         employerId:
 *           type: string
 *           description: ID of the employer posting the job
 *         views:
 *           type: number
 *           description: Number of times job was viewed
 *         applicationCount:
 *           type: number
 *           description: Number of applications received
 *         isActive:
 *           type: boolean
 *           description: Whether the job is currently active
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date job was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Date job was last updated
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all active jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all active jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       500:
 *         description: Server error
 */
export const getAllJobs = async (_: Request, res: Response) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate({
        path: "employerId",
        options: { strictPopulate: false }
      })
      .lean();

    // Filter out jobs with null employerId (orphaned jobs)
    const validJobs = jobs.filter(job => job.employerId);

    res.status(200).json({
      success: true,
      data: validJobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - company
 *               - requirements
 *               - responsibilities
 *               - category
 *               - jobType
 *               - location
 *               - deadline
 *               - employerId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *               description:
 *                 type: string
 *                 description: Job description
 *               company:
 *                 type: string
 *                 description: The name of the company posting the job
 *               requirements:
 *                 type: string
 *                 description: Job requirements
 *               responsibilities:
 *                 type: string
 *                 description: Job responsibilities
 *               category:
 *                 type: string
 *                 enum: [Technology, Healthcare, Finance, Education, Marketing, Sales, Engineering, Other]
 *               jobType:
 *                 type: string
 *                 enum: [Full-time, Part-time, Contract, Internship, Remote]
 *               location:
 *                 type: string
 *                 description: Job location
 *               salary:
 *                 type: string
 *                 description: Salary range (optional)
 *               experience:
 *                 type: string
 *                 description: Required years of experience (optional)
 *               education:
 *                 type: string
 *                 description: Required educational background (optional)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Keywords or skills related to the job (optional)
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline
 *               employerId:
 *                 type: string
 *                 description: ID of the employer
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
export const addJob = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      company,
      requirements,
      responsibilities,
      category,
      jobType,
      type, // Frontend might send 'type' instead of 'jobType'
      location,
      salary,
      experience,
      education,
      tags,
      deadline,
      employerId,
      image,
      hasBanner,
    } = req.body;

    // Use 'type' if 'jobType' is not provided
    const finalJobType = jobType || type;

    if (
      !title ||
      !description ||
      !company ||
      !requirements ||
      !responsibilities ||
      !category ||
      !finalJobType ||
      !location ||
      !deadline ||
      !employerId
    ) {
      return res.status(400).json({
        success: false,
        message: "all required fields are needed",
      });
    }

    const newJob = await Job.create({
      title,
      description,
      company,
      requirements,
      responsibilities,
      category,
      jobType: finalJobType,
      location,
      salary,
      experience,
      education,
      tags,
      deadline,
      employerId,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
    console.log("Job found:", job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    job.views += 1;
    await job.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("employerId");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/jobs/employer/{employerId}:
 *   get:
 *     summary: Get jobs by employer ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employer ID
 *     responses:
 *       200:
 *         description: List of jobs by employer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       500:
 *         description: Server error
 */
export const getJobsByEmployer = async (req: Request, res: Response) => {
  try {
    const employerIdStr = Array.isArray(req.params.employerId)
      ? req.params.employerId[0]
      : req.params.employerId;

    if (!mongoose.Types.ObjectId.isValid(employerIdStr)) {
      return res.status(400).json({ message: "Invalid employer ID" });
    }

    const employerId = new mongoose.Types.ObjectId(employerIdStr);
    const jobs = await Job.find({ employerId });

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/jobs/search:
 *   get:
 *     summary: Search jobs with filters
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for title or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Technology, Healthcare, Finance, Education, Marketing, Sales, Engineering, Other]
 *         description: Filter by category
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [Full-time, Part-time, Contract, Internship, Remote]
 *         description: Filter by job type
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       500:
 *         description: Server error
 */
export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { keyword, category, location, jobType } = req.query;

    let query: any = { isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;

    const jobs = await Job.find(query)
      .populate({
        path: "employerId",
        options: { strictPopulate: false }
      })
      .lean();

    // Filter out jobs with null employerId (orphaned jobs)
    const validJobs = jobs.filter(job => job.employerId);

    res.status(200).json({
      success: true,
      data: validJobs,
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};
