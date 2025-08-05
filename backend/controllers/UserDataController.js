import userInfoModel from "../models/PersonalInfoModel.js";
import userModel from "../models/UserModel.js";
const userData=async(req,res)=>{
    try {
        const normalizedEmail=req.body.email.toLowerCase();
        const info=await userInfoModel.findOne({email:normalizedEmail});
        const user=await userModel.findOne({email:normalizedEmail});
        if(info){
            res.json({success:true,data:{
                info:info||"",
                user:user||""
            }});
        }
        else{
            res.json({success:true,data:{
                info:info||"",
                user:user||""
            }});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,data:""});
    }
}

export default userData;