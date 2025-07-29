import mongoose from "mongoose";
const userInfoSchema=new mongoose.Schema({
 email:{type:String,required:true,unique:true},
 preferredLocations:{type:String,required:true},
 preferredRoles:{type:String,required:true},
 Availability:{type:String,required:true},
 priorExperience:{type:String,required:true},
 workFromHome:{type:Boolean,default:true},
 aboutYourSelf:{type:String,required:true},
 whyShouldWeHireYou:{type:String,required:true},
})