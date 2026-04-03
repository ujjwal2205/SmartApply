import {jobsInfo,updateJobStatus} from "../controllers/AppliedJobsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";
const jobsRouter=express.Router();
jobsRouter.post("/jobsInfo",jobsInfo);
jobsRouter.post("/updateStatus",authMiddleware,updateJobStatus);
export default jobsRouter;