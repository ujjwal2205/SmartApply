import jobsInfoModel from "../models/AppliedJobsModel.js";
const jobsInfo=async(req,res)=>{
    const {email,jobTitle,company,portal}=req.body;
    try {
        const normalizedEmail=email.toLowerCase();
        let appliedDate=new Date();
        let job={jobTitle,company,portal,appliedDate};
        let exist=await jobsInfoModel.findOne({email:normalizedEmail});
        if(exist){
         exist.jobs.push(job);
         await exist.save();
        }
        else{
            exist=new jobsInfoModel({
                email:normalizedEmail,
                jobs:[job],
            })
            await exist.save();
        }
        res.json({success:true,message:"Jobs added",data:exist})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
const updateJobStatus=async(req,res)=>{
    const {email,jobId,status}=req.body;
    try {
        const normalizedEmail=email.toLowerCase();
        const user=await jobsInfoModel.findOne({email:normalizedEmail});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const job=user.jobs.find(j=>j._id.toString()===jobId);
        if(!job){
            return res.json({success:false,message:"Job not found"});
        }
        job.status=status;
        await user.save();
        return res.json({success:true,message:"Job status updated!"});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export {jobsInfo,updateJobStatus};