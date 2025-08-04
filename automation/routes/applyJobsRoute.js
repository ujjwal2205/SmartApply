import express from "express";
import applyNaukriJobs from "../Controllers/naukriController.js";
import applyInternshalaJobs from "../Controllers/internshalaController.js";
import applyApnaJobs from "../Controllers/apnaJobsController.js";
const applyJobRouter=express.Router();
applyJobRouter.post("/NaukriJobs",applyNaukriJobs);
applyJobRouter.post("/InternshalaJobs",applyInternshalaJobs);
applyJobRouter.post("/ApnaJobs",applyApnaJobs);
export default applyJobRouter;