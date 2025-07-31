import jobsInfoModel from "../models/AppliedJobsModel.js";
const jobsInfo=async(req,res)=>{
    const {email,jobTitle,company,portal,status}=req.body;
    try {
        const normalizedEmail=email.toLowerCase();
        let job={jobTitle,company,portal,status};
        let exist=await jobsInfoModel.findOne({email:normalizedEmail});
        if(exist){
         exist.jobs.push(job);
         await exist.save();
        }
        else{
            exist=new jobsInfoModel({
                email:normalizedEmail,
                jobs:[job]
            })
            await exist.save();
        }
        res.json({success:true,message:"Jobs added",data:exist})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
export default jobsInfo;