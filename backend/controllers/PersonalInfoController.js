import userInfoModel from "../models/PersonalInfoModel.js";
import userModel from "../models/UserModel.js";
const userInfo=async(req,res)=>{
const {location,preferredRole,workFromHome,whyHire,firstName,middleName,lastName}=req.body;

try{
    const normalizedEmail=req.body.email.toLowerCase();
    const exist= await userInfoModel.findOne({email:normalizedEmail});
    const user=await userModel.findOne({email:normalizedEmail});
     if (!req.file) {
      return res.json({ success: false, message: "Resume file missing" });
    }
    if(!user){
        return res.json({success:false,message:"User doesn't exist"});
    }
    if(exist){
        await userInfoModel.updateOne(
            {email:normalizedEmail},
            {
            location:location,
            preferredRole:preferredRole,
            workFromHome:workFromHome,
            whyHire:whyHire,
            resume:{
                name:req.file.originalname,
                data:req.file.buffer,
                contentType:req.file.mimetype,
            },
        })
    }
    else{
        const newUser=new userInfoModel({
            email:normalizedEmail,
            location:location,
            preferredRole:preferredRole,
            workFromHome:workFromHome,
            whyHire:whyHire,
            resume:{
                name:req.file.originalname,
                data:req.file.buffer,
                contentType:req.file.mimetype,
            }
        })
        await newUser.save();
    }
    const safeMiddleName = middleName !== undefined && middleName !== null ? middleName : "";
    if(user){
        await userModel.updateOne(
            {email:normalizedEmail},
            {
                firstName:firstName,
                middleName:safeMiddleName,
                lastName:lastName
            }
        )
    }
    res.json({success:true,message:"Information has been saved successfully"})
}
catch(error){
    console.log(error);
    res.json({success:false,message:error.message});
}
}
export default userInfo;