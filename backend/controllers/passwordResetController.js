import userModel from "../models/UserModel.js";
import passwordResetModel from "../models/passwordResetModel.js";
import nodemailer from "nodemailer";
const passwordResetController=async(req,res)=>{
    const{email}=req.body;
    try {
        const normalizedEmail=email.toLowerCase();
        let exist=await userModel.findOne({email:normalizedEmail});
        if(!exist){
            res.json({success:false,message:"User doesn't exist"});
        }
        else{
            const otp=Math.floor(Math.random()*(9999-1000+1)+1000);
            const newUser=new passwordResetModel({
                email:normalizedEmail,
                resetOTP:otp,
                resetOTPExpiry:new Date()
            })
            await newUser.save();
            const transporter=nodemailer.createTransport({
                service:"gmail",
                auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}
            });
            await transporter.sendMail({
                to:email,
                subject:"Smart Apply Password Reset OTP",
                html:`<p>Your OTP is <b>${otp}</b>.It will expire in 10 minutes`
            });
            res.json({success:true,message:"OTP sent to your email"});
        }
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}
export default passwordResetController
