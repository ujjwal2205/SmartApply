import userModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import validator from "validator"

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
            password:hashedPassword
        })
        await newUser.save();
        res.json({success:true});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
export default signUpUser;