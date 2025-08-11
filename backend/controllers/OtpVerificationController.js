import passwordResetModel from "../models/passwordResetModel.js";
import userModel from "../models/UserModel.js";
import bcrypt from "bcrypt"
const OtpVerification=async(req,res)=>{
    const {email,otp,newPassword}=req.body;
    try {
        const normalizedEmail=email.toLowerCase();
        let user=await passwordResetModel.findOne({email:normalizedEmail});
        let info=await userModel.findOne({email:normalizedEmail});
        if(!user){
           return res.json({status:false,message:"OTP Expired"});
        }
        if(user.resetOTP!=otp){
            return res.json({status:false,message:"Invalid OTP"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(newPassword,salt);
        info.password=hashedPassword
        await info.save();
        res.json({success:true,message:"Password Changed successfully"});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export default OtpVerification;