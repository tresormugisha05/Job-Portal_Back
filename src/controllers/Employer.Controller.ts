import { Request, Response } from 'express';
import Employer from '../models/Employer.Model';
import User from '../models/User.Model';

// Helper function to check if user is an employer
const isUserEmployer = (user: any): boolean => {
  return user && user.role === "EMPLOYER";
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Employer:
 *       type: object
 *       required:
 *         - companyName
 *         - industry
 *         - companySize
 *         - description
 *         - location
 *         - contactEmail
 *         - contactPhone
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the employer
 *         companyName:
 *           type: string
 *           description: Name of the company
 *         industry:
 *           type: string
 *           description: Industry sector
 *         companySize:
 *           type: string
 *           description: Size of the company (e.g., '1-10', '11-50', '51-200', '201-500', '500+')
 *         website:
 *           type: string
 *           description: Company website URL (optional)
 *         description:
 *           type: string
 *           description: Company description
 *         location:
 *           type: string
 *           description: Company location
 *         contactEmail:
 *           type: string
 *           format: email
 *           description: Contact email address
 *         contactPhone:
 *           type: string
 *           description: Contact phone number
 *         userId:
 *           type: string
 *           description: ID of the associated user account
 *         logo:
 *           type: string
 *           description: Company logo URL (optional)
 *         isVerified:
 *           type: boolean
 *           default: false
 *           description: Whether the employer is verified
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date the employer profile was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Date the employer profile was last updated
 */

/**
 * @swagger
 * /api/employers:
 *   get:
 *     summary: Get all employers
 *     tags: [Employers]
 *     responses:
 *       200:
 *         description: List of all employers
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
 *                     $ref: '#/components/schemas/Employer'
 *       500:
 *         description: Server error
 */
export const getAllEmployers = async (_: Request, res: Response) => {
  try {
    const employers = await Employer.find().populate('userId');
    res.status(200).json({
      success: true,
      data: employers,
    });
  } catch (error) {
    console.error("Error fetching employers:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/employers:
 *   post:
 *     summary: Create a new employer profile
 *     tags: [Employers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - industry
 *               - companySize
 *               - description
 *               - location
 *               - contactEmail
 *               - contactPhone
 *               - userId
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: Company name
 *               industry:
 *                 type: string
 *                 description: Industry sector
 *               companySize:
 *                 type: string
 *                 description: Company size
 *               website:
 *                 type: string
 *                 description: Company website (optional)
 *               description:
 *                 type: string
 *                 description: Company description
 *               location:
 *                 type: string
 *                 description: Company location
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 description: Contact email
 *               contactPhone:
 *                 type: string
 *                 description: Contact phone
 *               userId:
 *                 type: string
 *                 description: ID of the associated user account
 *               logo:
 *                 type: string
 *                 description: Company logo URL (optional)
 *     responses:
 *       201:
 *         description: Employer profile created successfully
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
 *                   $ref: '#/components/schemas/Employer'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export const addEmployer = async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      industry,
      companySize,
      website,
      description,
      location,
      contactEmail,
      contactPhone,
      userId
    } = req.body;

    if (!companyName || !industry || !companySize || !description || !location || !contactEmail || !contactPhone || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingEmployer = await Employer.findOne({ userId });
    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: "Employer profile already exists for this user"
      });
    }

    const user = await User.findById(userId);
    if (!isUserEmployer(user)) {
      return res.status(400).json({
        success: false,
        message: "User not found or not an employer type"
      });
    }

    const newEmployer = await Employer.create({
      companyName,
      industry,
      companySize,
      website,
      description,
      location,
      contactEmail,
      contactPhone,
      userId
    });

    if (user) {
      user.employerId = newEmployer._id as any;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Employer profile created successfully',
      data: newEmployer
    });
  } catch (error) {
    console.error('Error creating employer:', error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/employers/{id}:
 *   get:
 *     summary: Get an employer by ID
 *     tags: [Employers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Employer ID
 *     responses:
 *       200:
 *         description: Employer details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Employer'
 *       404:
 *         description: Employer not found
 *       500:
 *         description: Server error
 */
export const getEmployerById = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found"
      });
    }

    res.status(200).json({
      success: true,
      data: employer,
    });
  } catch (error) {
    console.error("Error fetching employer:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/employers/{id}:
 *   put:
 *     summary: Update an employer profile
 *     tags: [Employers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Employer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employer'
 *     responses:
 *       200:
 *         description: Employer updated successfully
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
 *                   $ref: '#/components/schemas/Employer'
 *       404:
 *         description: Employer not found
 *       500:
 *         description: Server error
 */
export const updateEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('userId');
    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employer updated successfully",
      data: employer,
    });
  } catch (error) {
    console.error("Error updating employer:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/employers/{id}:
 *   delete:
 *     summary: Delete an employer profile
 *     tags: [Employers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Employer ID
 *     responses:
 *       200:
 *         description: Employer deleted successfully
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
 *         description: Employer not found
 *       500:
 *         description: Server error
 */
export const deleteEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found"
      });
    }

    await User.findByIdAndUpdate(employer.userId, { $unset: { employerId: 1 } });

    res.status(200).json({
      success: true,
      message: "Employer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employer:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};
/**
 * @swagger
 * /api/employers/{id}/verify:
 *   patch:
 *     summary: Verify or unverify an employer (Admin only)
 *     tags: [Employers]
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
 *         description: Employer verification status updated successfully
 *       404:
 *         description: Employer not found
 *       500:
 *         description: Server error
 */
export const verifyEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    employer.isVerified = !employer.isVerified;
    await employer.save();

    res.status(200).json({
      success: true,
      message: `Employer ${employer.isVerified ? "verified" : "unverified"} successfully`,
      data: { isVerified: employer.isVerified },
    });
  } catch (error) {
    console.error("Error verifying employer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
