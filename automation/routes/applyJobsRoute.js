import express from "express";
import applyNaukriJobs from "../Controllers/naukriController.js";
const applyJobRouter=express.Router();
applyJobRouter.post("/NaukriJobs",applyNaukriJobs);
export default applyJobRouter;