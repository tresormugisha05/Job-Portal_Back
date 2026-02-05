import { Request, Response } from 'express';
import User from '../models/User.Model';
export const getAllUsers = async (_:Request, res: Response) => {
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

export const addUser = async (req: Request, res: Response) => {
  try {
    const {  FirstName,LastName,password,
      UserType} = req.body;
      if(!FirstName||!LastName||!password||!UserType){
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
      }
    const NewUser = await User.create(
        {
            FirstName:FirstName,
            LastName:LastName,
            password:password,
            UserType:UserType,
        }
    )
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: NewUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({message:"sorry please try again"});
  }
};

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