import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employer from "../models/Employer.Model";
import User from "../models/User.Model";
import Job from "../models/Job.Model";

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
    const employers = await Employer.find();
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
 * /api/employers/register:
 *   post:
 *     summary: Register a new employer
 *     tags: [Employers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, phone, companyName]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               companyName: { type: string }
 *               industry: { type: string }
 *               companySize: { type: string }
 *               website: { type: string }
 *               description: { type: string }
 *               location: { type: string }
 *               contactPhone: { type: string }
 *     responses:
 *       201:
 *         description: Employer registered successfully
 *       400:
 *         description: Invalid data or email already exists
 *       500:
 *         description: Server error
 */
export const registerEmployer = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      phone,
      companyName,
    } = req.body;

    // Validate required fields for initial registration
    if (!companyName || !email || !password || !phone) {
      console.log()
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: companyName, email, password, phone"
      });
    }

    // Check if employer already exists
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: "Email already exists for this Employer",
      });
    }

    const employer = await Employer.create({
      // name removed
      email,
      password,
      phone,
      companyName,
      isVerified: false, // Default to unverified
    });

    // Generate token
    const token = jwt.sign(
      { id: employer._id, userType: "employer" },
      process.env.JWT_SECRET!,
      { expiresIn: "14d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: employer._id,
        name: employer.companyName, // Map companyName to name
        email: employer.email,
        role: "EMPLOYER",
        companyName: employer.companyName,
      },
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/**
 * @swagger
 * /api/employers/login:
 *   post:
 *     summary: Login employer
 *     tags: [Employers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
export const loginEmployer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for employer
    const employer = await Employer.findOne({ email }).select("+password");
    if (employer && (await bcrypt.compare(password, employer.password))) {
      const token = jwt.sign(
        { id: employer._id, userType: "employer" },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: employer._id,
          name: employer.companyName, // Map companyName to name
          email: employer.email,
          role: "EMPLOYER",
          companyName: employer.companyName,
          isVerified: employer.isVerified, // Include verification status
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @swagger
// /api/employers:
//   post:
//     summary: Create a new employer profile (Admin only)
//     tags: [Employers]
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             $ref: '#/components/schemas/Employer'
//     responses:
//       201:
//         description: Employer created successfully
//       400:
//         description: Bad request
//       500:
//         description: Server error
export const addEmployer = async (req: Request, res: Response) => {
  try {
    // This function is now for admin-created employers or manual additions
    const employer = await Employer.create(req.body);

    res.status(201).json({
      success: true,
      data: employer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create employer",
    });
  }
};


// @swagger
// /api/employers/{id}:
//   get:
//     summary: Get an employer by ID
//     tags: [Employers]
//     parameters:
//       - in: path
//         name: id
//         required: true
//         schema:
//           type: string
//     responses:
//       200:
//         description: Employer details
//         content:
//           application/json:
//             schema:
//               type: object
//               properties:
//                 success:
//                   type: boolean
//                 data:
//                   $ref: '#/components/schemas/Employer'
//       404:
//         description: Employer not found
//       500:
//         description: Server error
export const getEmployerById = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findById(req.params.id).select("-password");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @swagger
// /api/employers/{id}:
//   put:
//     summary: Update an employer profile
//     tags: [Employers]
//     parameters:
//       - in: path
//         name: id
//         required: true
//         schema:
//           type: string
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             $ref: '#/components/schemas/Employer'
//     responses:
//       200:
//         description: Employer updated successfully
//       404:
//         description: Employer not found
//       500:
//         description: Server error
export const updateEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @swagger
// /api/employers/{id}:
//   delete:
//     summary: Delete an employer profile
//     tags: [Employers]
//     parameters:
//       - in: path
//         name: id
//         required: true
//         schema:
//           type: string
//     responses:
//       200:
//         description: Employer deleted successfully
//         content:
//           application/json:
//             schema:
//               type: object
//               properties:
//                 success:
//                   type: boolean
//                 message:
//                   type: string
//       404:
//         description: Employer not found
//       500:
//         description: Server error
export const deleteEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findById(req.params.id);

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    await employer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employer deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @swagger
// /api/employers/{id}/verify:
//   patch:
//     summary: Verify or unverify an employer (Admin only)
//     tags: [Employers]
//     security:
//       - bearerAuth: []
//     parameters:
//       - in: path
//         name: id
//         required: true
//         schema:
//           type: string
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             type: object
//             properties:
//               isVerified:
//                 type: boolean
//     responses:
//       200:
//         description: Employer verification status updated successfully
//       404:
//         description: Employer not found
//       500:
//         description: Server error
export const verifyEmployer = async (req: Request, res: Response) => {
  try {
    const { isVerified } = req.body;

    const employer = await Employer.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select("-password");

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employer,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const getTopHiringCompanies = async (_: Request, res: Response) => {
  try {
    const employers = await Employer.find({ isVerified: true });

    const employersWithJobCount = await Promise.all(
      employers.map(async (employer: any) => {
        const jobCount = await Job.countDocuments({
          employerId: employer._id.toString(),
          isActive: true
        });
        return {
          ...employer.toObject(),
          jobCount,
        };
      }),
    );

    const topEmployers = employersWithJobCount
      .filter((e: any) => e.jobCount > 0)
      .sort((a: any, b: any) => b.jobCount - a.jobCount)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: topEmployers,
    });
  } catch (error) {
    console.error("Error fetching top hiring companies:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}; 