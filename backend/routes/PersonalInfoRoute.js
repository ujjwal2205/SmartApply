import multer from "multer";
import userInfo from "../controllers/PersonalInfoController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const upload=multer();
const userRoute=express.Router();
userRoute.post("/information",upload.single("resume"),authMiddleware,userInfo);
export default userRoute