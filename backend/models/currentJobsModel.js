import mongoose, { Mongoose } from "mongoose";
const currJobs=new mongoose.Schema({
    jobTitle:{type:String,required:true},
    company:{type:String,required:true},
    portal:{type:String,required:true}
})
const currJobsInfo=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    jobs:[currJobs],
    Expiry:{
        type:Date,
        expires:1800
    }
})
const currjobsInfoModel=mongoose.models.CurrJobsInfo||mongoose.model("CurrJobsInfo",currJobsInfo);
export default currjobsInfoModel;