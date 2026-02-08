import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.Model';

const generateToken = (id: string, userType: string) => {
  return jwt.sign(
    { id, role: userType },
    process.env.JWT_SECRET!,
    { expiresIn: '14d' }
  );
};

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
 * /api/auth/register:
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

    // Check if user already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Get profile picture URL if uploaded
    const profileUrl = req.file ? req.file.path : undefined;

    const NewUser = await User.create({
      FirstName,
      LastName,
      Email,
      Age,
      PhoneNumber,
      password,
      UserType,
      profile: profileUrl
    });

    const token = generateToken(NewUser._id.toString(), NewUser.UserType);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: NewUser._id,
        FirstName: NewUser.FirstName,
        LastName: NewUser.LastName,
        Email: NewUser.Email,
        UserType: NewUser.UserType,
        profile: NewUser.profile
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      success: false,
      message: "User creation failed",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * @swagger
 * /api/auth/{id}:
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
 * /api/auth/{id}:
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
 * /api/auth/{id}:
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserName
 *               - password
 *             properties:
 *               UserName:
 *                 type: string
 *                 description: User username
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     FirstName:
 *                       type: string
 *                     LastName:
 *                       type: string
 *                     Email:
 *                       type: string
 *                     UserType:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { UserName, password } = req.body;

    if (!UserName || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const user = await User.findOne({ UserName });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    const token = generateToken(user._id.toString(), user.UserType);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        UserType: user.UserType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
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
// Logout User
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Logout failed" });
  }
};

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid current password
 *       401:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Change Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: "Password change failed" });
  }
};
