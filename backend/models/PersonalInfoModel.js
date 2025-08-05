import mongoose from "mongoose";
const userInfoSchema=new mongoose.Schema({
 email:{type:String,required:true,unique:true},
 location:{type:String},
 preferredRole:{type:String,required:true},
 workFromHome:{type:String,default:true},
 whyHire:{type:String,required:true},
 resume:{
    name:String,
    data:Buffer,
    contentType:String,
 }
})
const userInfoModel=mongoose.models.info || mongoose.model("info",userInfoSchema);
export default userInfoModel