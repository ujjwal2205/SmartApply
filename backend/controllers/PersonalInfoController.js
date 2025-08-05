import userInfoModel from "../models/PersonalInfoModel.js";
const userInfo=async(req,res)=>{
const {location,preferredRole,workFromHome,whyHire,resume}=req.body;
try{
    const normalizedEmail=req.body.email.toLowerCase();
    const exist= await userInfoModel.findOne({email:normalizedEmail});
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
    res.json({success:true,message:"Information has been saved successfully"})
}
catch(error){
    console.log(error);
    res.json({success:false,message:error.message});
}
}
export default userInfo;