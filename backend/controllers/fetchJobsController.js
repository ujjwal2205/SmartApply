import jobsInfoModel from "../models/AppliedJobsModel.js";
const fetchJobs=async(req,res)=>{
    const {email}=req.body;
    try{
     const normalizedEmail=email.toLowerCase();
     let exist=await jobsInfoModel.findOne({email:normalizedEmail});
     if(exist){
        res.json({success:true,data:exist.jobs});
     }
     else{
        res.json({success:true,data:[]});
     }
    }
    catch(error){
    console.log(error);
    res.json({success:false,message:error.message});
    }
}
export default fetchJobs;