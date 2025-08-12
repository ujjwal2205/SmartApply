import currentJobs from "../controllers/currentJobsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";
const currJob=express.Router();
currJob.post("/fetch",authMiddleware,currentJobs);
export default currJob;