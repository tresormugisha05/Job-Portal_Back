import { Request, Response } from 'express';
import User from '../models/User.Model';
import Employer from '../models/Employer.Model';
import Job from '../models/Job.Model';
import Application from '../models/Application.Model';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

export const getAllEmployers = async (req: Request, res: Response) => {
  try {
    const employers = await Employer.find().select('-password');
    res.status(200).json({
      success: true,
      count: employers.length,
      data: employers
    });
  } catch (error) {
    console.error("Error fetching employers:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find();
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
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

export const deleteEmployer = async (req: Request, res: Response) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employer:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
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

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployers = await Employer.countDocuments();
    const totalApplicants = await User.countDocuments({ UserType: 'Applicant' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEmployers,
        totalApplicants,
        totalJobs,
        totalApplications
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "sorry please try again" });
  }
};