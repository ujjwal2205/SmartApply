import express from "express";
import {signUpUser,login,googleLogin} from "../controllers/UserController.js";

const userRouter=express.Router();

userRouter.post("/signUp",signUpUser);
userRouter.post("/login",login)
userRouter.post("/googleLogin",googleLogin);
export default userRouter;