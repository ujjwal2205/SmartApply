import express from "express";
import applyNaukriJobs from "../Controllers/naukriController.js";
import applyInternshalaJobs from "../Controllers/internshalaController.js";
import applylinkedInJobs from "../Controllers/linkedInController.js";
const applyJobRouter=express.Router();
applyJobRouter.post("/NaukriJobs",applyNaukriJobs);
applyJobRouter.post("/InternshalaJobs",applyInternshalaJobs);
applyJobRouter.post("/LinkedInJobs",applylinkedInJobs);
export default applyJobRouter;