import fetchJobs from "../controllers/fetchJobsController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const fetchJobsRouter=express.Router();
fetchJobsRouter.post("/fetchJobs",authMiddleware,fetchJobs);
export default fetchJobsRouter;