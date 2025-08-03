import linkedInJobs from "../applyJob/linkedIn.js";
const applylinkedInJobs=async(req,res)=>{
    const {email}=req.body;
     try{
        let normalizedEmail=email.toLowerCase();
        await linkedInJobs(normalizedEmail);
        res.json({success:true,message:"LinkedIn Completed"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
export default applylinkedInJobs;