import multer from "multer";
import userInfo from "../controllers/PersonalInfoController.js";
import express from "express";

const upload=multer();
const userRoute=express.Router();
userRoute.post("/information",upload.single("resume"),userInfo)

export default userRoute