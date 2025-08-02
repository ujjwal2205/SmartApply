import naukriJobs from "../applyJob/naukri.js";
const applyNaukriJobs=async(req,res)=>{
    const {email}=req.body;
    try{
        let normalizedEmail=email.toLowerCase();
        await naukriJobs(normalizedEmail);
        res.json({success:true,message:"Naukri Completed"});
    }
    catch(error){
      console.log(error);
      res.json({success:false,message:error.message});
    }
}
export default applyNaukriJobs;