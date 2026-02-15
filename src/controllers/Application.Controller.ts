import { Request, Response } from 'express';
import Application from '../models/Application.Model';
import Job from '../models/Job.Model';
/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - jobId
 *         - userId
 *         - employerId
 *         - resume
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the application
 *         jobId:
 *           type: string
 *           description: ID of the job being applied for
 *         userId:
 *           type: string
 *           description: ID of the user applying
 *         employerId:
 *           type: string
 *           description: ID of the employer
 *         resume:
 *           type: string
 *           description: Resume file path or URL
 *         coverLetter:
 *           type: string
 *           description: Cover letter content
 *         status:
 *           type: string
 *           enum: [PENDING, REVIEWED, SHORTLISTED, REJECTED, HIRED]
 *           default: PENDING
 *           description: Application status
 *         notes:
 *           type: string
 *           description: Employer notes about the application
 *         submissionDate:
 *           type: string
 *           format: date
 *           description: Date application was submitted
 *         lastUpdated:
 *           type: string
 *           format: date
 *           description: Date application was last updated
 */

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List of all applications
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
 *                     $ref: '#/components/schemas/Application'
 *       500:
 *         description: Server error
 */
export const getAllApplications = async (_: Request, res: Response) => {
  try {
    const applications = await Application.find()
      .populate('jobId')
      .populate('userId')
      .populate('employerId');

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit a job application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - userId
 *               - employerId
 *               - resume
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job
 *               userId:
 *                 type: string
 *                 description: ID of the user applying
 *               employerId:
 *                 type: string
 *                 description: ID of the employer
 *               resume:
 *                 type: string
 *                 description: Resume file path or URL
 *               coverLetter:
 *                 type: string
 *                 description: Cover letter content (optional)
 *     responses:
 *       201:
 *         description: Application submitted successfully
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
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Missing required fields or already applied
 *       404:
 *         description: Job not found or inactive
 *       500:
 *         description: Server error
 */
export const submitApplication = async (req: Request, res: Response) => {
  try {
    console.log('=== Application Submission Debug ===');
    console.log('req.params:', req.params);
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    // Extract jobId first
    const jobId = req.params.jobId || req.body.jobId;

    // Get job details to ensure it exists and to get employerId
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      console.log('Job not found or inactive');
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer active"
      });
    }

    if (new Date() > job.deadline) {
      console.log('Application deadline passed');
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed"
      });
    }

    // Use authenticated user ID and job's employer ID
    const userIdObj = (req as any).user._id || (req as any).user.id;
    const userId = userIdObj ? String(userIdObj) : undefined;

    // Check if employerId exists on job
    if (!job.employerId) {
      console.error('Job found but employerId is missing:', job);
      return res.status(500).json({
        success: false,
        message: "Job data is corrupted (missing employerId)"
      });
    }

    const employerId = String(job.employerId);

    const name = req.body.name;
    const email = req.body.email;

    console.log('Extracted values for creation:', {
      jobId,
      userId,
      userIdType: typeof userId,
      employerId,
      employerIdType: typeof employerId,
      name,
      email
    });

    // Validate ObjectId format
    if (!jobId || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid jobId format:', jobId);
      return res.status(400).json({
        success: false,
        message: "Invalid job ID format"
      });
    }

    // Extract resume file path from uploaded files
    let resume = '';

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files.resume && files.resume[0]) {
        // Cloudinary stores the URL in 'path' property
        resume = files.resume[0].path || files.resume[0].filename;
        console.log('Resume file found:', resume);
      } else {
        console.log('No resume file in req.files');
      }
    } else {
      console.log('req.files is undefined');
    }

    const coverLetter = req.body.coverLetter || '';

    if (!jobId || !userId || !employerId || !resume || !name || !email) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: "jobId, userId, employerId, name, email, and resume are required"
      })
    }

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      console.log('User already applied for this job');
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    const newApplication = await Application.create({
      jobId,
      userId,
      employerId,
      name,
      email,
      resume,
      coverLetter
    });

    job.applicationCount += 1;
    await job.save();

    console.log('Application created successfully:', newApplication._id);
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: newApplication
    });
  } catch (error) {
    console.error('=== Error submitting application ===');
    console.error('Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get an application by ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('userId')
      .populate('employerId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/applications/{id}/status:
 *   put:
 *     summary: Update application status
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, shortlisted, rejected, hired]
 *                 description: New application status
 *               notes:
 *                 type: string
 *                 description: Employer notes (optional)
 *     responses:
 *       200:
 *         description: Application status updated successfully
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
 *                   $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).populate('jobId').populate('userId').populate('employerId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a specific job
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: List of applications for the job
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
 *                     $ref: '#/components/schemas/Application'
 *       500:
 *         description: Server error
 */
export const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId')
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/applications/user/{userId}:
 *   get:
 *     summary: Get applications by user ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's applications
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
 *                     $ref: '#/components/schemas/Application'
 *       500:
 *         description: Server error
 */
export const getApplicationsByUser = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate('jobId')
      .populate('employerId')
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/applications/employer/{employerId}:
 *   get:
 *     summary: Get applications by employer ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: employerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employer ID
 *     responses:
 *       200:
 *         description: List of applications for employer's jobs
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
 *                     $ref: '#/components/schemas/Application'
 *       500:
 *         description: Server error
 */
export const getApplicationsByEmployer = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ employerId: req.params.employerId })
      .populate('jobId')
      .populate('userId')
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching employer applications:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
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
 *         description: Application not found
 *       500:
 *         description: Server error
 */
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const job = await Job.findById(application.jobId);
    if (job && job.applicationCount > 0) {
      job.applicationCount -= 1;
      await job.save();
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};