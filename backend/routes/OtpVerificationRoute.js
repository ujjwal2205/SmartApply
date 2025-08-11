import OtpVerification from "../controllers/OtpVerificationController.js";
import express from "express";
const Verification=express.Router();
Verification.post("/verification",OtpVerification);
export default Verification;