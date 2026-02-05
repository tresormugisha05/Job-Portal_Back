import { Request, Response } from 'express';
import Employer from '../models/Employer.Model';
import User from '../models/User.Model';

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
    
    if(!companyName || !industry || !companySize || !description || !location || !contactEmail || !contactPhone || !userId){
      return res.status(400).json({
        success:false,
        message:"all fields are required"
      })
    }
    
    const existingEmployer = await Employer.findOne({ userId });
    if (existingEmployer) {
      return res.status(400).json({
        success: false,
        message: "Employer profile already exists for this user"
      });
    }
    
    const user = await User.findById(userId);
    if (!user || user.UserType !== "Employer") {
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
    
    user.employerId = newEmployer._id.toString();
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Employer profile created successfully',
      data: newEmployer
    });
  } catch (error) {
    console.error('Error creating employer:', error);
    res.status(500).json({message:"sorry please try again"});
  }
};

export const getEmployerById = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findById(req.params.id).populate('userId');

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
  } catch (error) {
    console.error("Error fetching employer:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

export const updateEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('userId');

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
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

export const deleteEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
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

export const getEmployerByUserId = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findOne({ userId: req.params.userId }).populate('userId');
    
    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer profile not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: employer,
    });
  } catch (error) {
    console.error("Error fetching employer by user ID:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

export const verifyEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true, runValidators: true }
    ).populate('userId');

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employer verified successfully",
      data: employer,
    });
  } catch (error) {
    console.error("Error verifying employer:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};
