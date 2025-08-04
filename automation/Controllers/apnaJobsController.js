import apnaJobs from "../applyJob/apnaJobs.js";
const applyApnaJobs=async(req,res)=>{
    const{email}=req.body;
    try{
     let normalizedEmail=email.toLowerCase();
        await apnaJobs(normalizedEmail);
        res.json({success:true,message:"ApnaJobs Completed"});
    }
    catch(error){
      console.log(error);
      res.json({success:false,message:error.message});
    }
}
export default applyApnaJobs;