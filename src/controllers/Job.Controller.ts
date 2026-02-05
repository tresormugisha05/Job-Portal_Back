import { Request, Response } from 'express';
import Job from '../models/Job.Model';

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

export const addJob = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      requirements, 
      responsibilities,
      category, 
      jobType, 
      location, 
      salary, 
      deadline, 
      employerId 
    } = req.body;
    
    if(!title || !description || !requirements || !responsibilities || !category || !jobType || !location || !deadline || !employerId){
      return res.status(400).json({
        success:false,
        message:"all required fields are needed"
      })
    }
    
    const newJob = await Job.create({
      title,
      description,
      requirements,
      responsibilities,
      category,
      jobType,
      location,
      salary,
      deadline,
      employerId
    });
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({message:"sorry please try again"});
  }
};

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

export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { keyword, category, location, jobType } = req.query;
    
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