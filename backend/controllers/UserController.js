import userModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import express from "express";
import verifyGoogleToken from "../middleware/auth.js";
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
} 
//sign up user
const signUpUser=async(req,res)=>{
    const {firstName,middleName,lastName,email,password}=req.body;
    try{
        // if user already exists
        const normalizedEmail=email.toLowerCase();
        const exists=await userModel.findOne({email:normalizedEmail});
        if(exists){
            return res.json({success:false,message:"User Already Exists"})
        }
        //if email is valid
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please Enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Please Enter a Strong Password"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new userModel({
            firstName:firstName,
            middleName:middleName,
            lastName:lastName,
            email:normalizedEmail,
            password:hashedPassword,
            authType:"local"
        })
        await newUser.save();
        const token=createToken(newUser._id);
        res.json({success:true,message:"Signed In Successfully",token});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

//Login
const login= async (req,res)=>{
    const {email,password}=req.body;
    try{
        const normalizedEmail=email.toLowerCase();
        const user=await userModel.findOne({email:normalizedEmail});
        if(!user){
            return res.json({success:false,message:"User doesn't exist"});
        }
        if(user.authType==='google'){
            return res.json({success:false,message:"Please login via Google Sign-in.'"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token=createToken(user._id);
        res.json({success:true,token});
    }
    catch(error){
     console.log(error);
     res.json({success:false,message:error.message})
    }
}
//googleLogin
const googleLogin= async (req,res)=>{
 try{
    const {idToken}=req.body;
    const googleUser=await verifyGoogleToken(idToken);
    const {email,given_name,family_name}=googleUser;
    const normalizeEmail=email.toLowerCase()
    let user=await userModel.findOne({email:normalizeEmail});
    if(!user){
         user=new userModel({
            email:normalizeEmail,
            firstName:given_name,
            lastName:family_name||"N/A",
            authType:"google"
        });
    await user.save();
    }
     const token= createToken(user._id)
     res.json({status:true,token});
 }
 catch(error){
  console.log(error);
  res.json({status:false,message:"Invalid Token"});
 }
}
export {signUpUser,login,googleLogin};