import mongoose from "mongoose";
const jobsSchema=new mongoose.Schema({
    jobTitle:{type:String},
    company:{type:String},
    portal:{type:String},
})
const jobsInfoSchema=new mongoose.Schema({
    email:{type:String,unique:true,required:true},
    jobs:[jobsSchema]
})
const jobsInfoModel=mongoose.models.jobs || mongoose.model("jobs",jobsInfoSchema);
export default jobsInfoModel;