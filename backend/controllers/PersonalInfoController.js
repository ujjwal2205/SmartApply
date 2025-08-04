import userInfoModel from "../models/PersonalInfoModel.js";
const userInfo=async(req,res)=>{
const {preferredLocations,preferredRoles,Availability,priorExperience,workFromHome,aboutYourSelf,whyShouldWeHireYou,resume}=req.body;
try{
    const normalizedEmail=req.body.email.toLowerCase();
    const exist= await userInfoModel.findOne({email:normalizedEmail});
    if(exist){
        await userInfoModel.updateOne(
            {email:normalizedEmail},
            {
            preferredLocations:preferredLocations,
            preferredRoles:preferredRoles,
            Availability:Availability,
            priorExperience:priorExperience,
            workFromHome:workFromHome,
            aboutYourSelf:aboutYourSelf,
            whyShouldWeHireYou:whyShouldWeHireYou,
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
            preferredLocations:preferredLocations,
            preferredRoles:preferredRoles,
            Availability:Availability,
            priorExperience:priorExperience,
            workFromHome:workFromHome,
            aboutYourSelf:aboutYourSelf,
            whyShouldWeHireYou:whyShouldWeHireYou,
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