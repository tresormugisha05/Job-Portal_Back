import { Request, Response } from 'express';
import User from '../models/User.Model';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - FirstName
 *         - LastName
 *         - Age
 *         - PhoneNumber
 *         - password
 *         - UserType
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         FirstName:
 *           type: string
 *           description: First name of the user
 *         LastName:
 *           type: string
 *           description: Last name of the user
 *         Age:
 *           type: string
 *           description: Age of the user
 *         PhoneNumber:
 *           type: string
 *           description: Phone number of the user
 *         password:
 *           type: string
 *           description: Hashed password of the user
 *         profile:
 *           type: string
 *           description: Profile picture URL (optional)
 *         UserType:
 *           type: string
 *           enum: [Employer, Applicant]
 *           description: Type of user
 *         resetPasswordToken:
 *           type: string
 *           description: Token for password reset (optional)
 *         resetPasswordExpires:
 *           type: string
 *           format: date
 *           description: Expiration date for reset token (optional)
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date user was created
 *         employerId:
 *           type: string
 *           description: ID of associated employer profile (for employers)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
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
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FirstName
 *               - LastName
 *               - password
 *               - UserType
 *             properties:
 *               FirstName:
 *                 type: string
 *                 description: First name
 *               LastName:
 *                 type: string
 *                 description: Last name
 *               password:
 *                 type: string
 *                 description: Password (will be hashed)
 *               UserType:
 *                 type: string
 *                 enum: [Employer, Applicant]
 *                 description: User type
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
export const addUser = async (req: Request, res: Response) => {
  try {
    const {
      FirstName,
      LastName,
      Age,
      Email,
      PhoneNumber,
      password,
      UserType,
    } = req.body;

    if (
      !FirstName ||
      !LastName ||
      !Email||
      !Age ||
      !PhoneNumber ||
      !password ||
      !UserType
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const NewUser = await User.create({
      FirstName,
      LastName,
      Email,
      Age,
      PhoneNumber,
      password,
      UserType,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: NewUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};
/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: All users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await User.deleteMany({});

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} users`,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};
