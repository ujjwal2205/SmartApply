import mongoose from "mongoose";
const userInfoSchema=new mongoose.Schema({
 email:{type:String,required:true,unique:true},
 preferredLocations:{type:String},
 preferredRoles:{type:String,required:true},
 Availability:{type:String,required:true},
 priorExperience:{type:String,required:true},
 workFromHome:{type:String,default:true},
 aboutYourSelf:{type:String,required:true},
 whyShouldWeHireYou:{type:String,required:true},
 resume:{
    name:String,
    data:Buffer,
    contentType:String,
 }
})
const userInfoModel=mongoose.models.info || mongoose.model("info",userInfoSchema);
export default userInfoModel