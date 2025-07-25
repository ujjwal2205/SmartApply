import express from "express";
import {signUpUser,login} from "../controllers/UserController.js";

const userRouter=express.Router();

userRouter.post("/signUp",signUpUser);
userRouter.post("/login",login)
export default userRouter;