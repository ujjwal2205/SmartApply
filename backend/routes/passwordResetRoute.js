import passwordResetController from "../controllers/passwordResetController.js";
import express from "express";
const passwordReset=express.Router();
passwordReset.post("/otp",passwordResetController);
export default passwordReset;