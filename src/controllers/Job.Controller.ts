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
 *         deadline:
 *           type: string
 *           format: date
 *         employerId:
 *           type: string
 *         experience:
 *           type: string
 *         education:
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
    const jobs = await Job.find({ isActive: true }).populate('employerId');
    res.status(200).json({
      success: true,
      data: jobs,
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
      logo,
      logoBg,
      description,
      requirements,
      responsibilities,
      category,
      jobType,
      type,
      typeBg,
      location,
      salary,
      deadline,
      employerId,
      experience,
      education,
      featured
    } = req.body;

    if (!title || !logo || !description || !requirements || !responsibilities || !category || !jobType || !type || !typeBg || !location || !deadline || !employerId) {
      return res.status(400).json({
        success: false,
        message: "all required fields are needed"
      })
    }

    const employer = await Employer.findOne({ _id: employerId });
    if (!employer || !employer.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your employer profile must be verified by an admin before you can post jobs."
      });
    }

    const newJob = await Job.create({
      title,
      logo,
      logoBg,
      description,
      requirements,
      responsibilities,
      category,
      jobType,
      type,
      typeBg,
      location,
      salary,
      deadline,
      employerId,
      experience,
      education,
      featured
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
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
    const job = await Job.findById(req.params.id).populate('employerId');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "sorry please try again" });
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
    }).populate('employerId');

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
    const jobs = await Job.find({ employerId: req.params.employerId });

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

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/jobs/{id}/status:
 *   patch:
 *     summary: Toggle job active status (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job status updated successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Server error
 */
export const toggleJobStatus = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job ${job.isActive ? "activated" : "suspended"} successfully`,
      data: { isActive: job.isActive },
    });
  } catch (error) {
    console.error("Error toggling job status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
