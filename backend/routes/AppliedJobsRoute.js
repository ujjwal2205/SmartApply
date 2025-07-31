import jobsInfo from "../controllers/AppliedJobsController.js";
import express from "express";
const jobsRouter=express.Router();
jobsRouter.post("/jobsInfo",jobsInfo);
export default jobsRouter;