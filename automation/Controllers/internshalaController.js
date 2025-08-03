import internshalaJobs from "../applyJob/internshala.js";
const applyInternshalaJobs=async(req,res)=>{
    const {email}=req.body;
    try{
        let normalizedEmail=email.toLowerCase();
        await internshalaJobs(normalizedEmail);
        res.json({success:true,message:"Internshala Completed"});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
export default applyInternshalaJobs;