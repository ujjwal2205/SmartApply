import express from "express";
import userData from "../controllers/UserDataController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const userDataRoute=express.Router();
userDataRoute.post("/userData",authMiddleware,userData);
export default userDataRoute;