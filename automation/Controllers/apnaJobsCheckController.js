import apnaJobsCheck from "../checkSession/apnaJobsCheck.js"
const checkApnaJobs=async(req,res)=>{
    try {
        const result=await apnaJobsCheck();
        if(result.success){
            res.json({success:true,message:result.message});
        }
        else{
            res.json({success:false,message:result.message});
        }
    } catch (error) {
        console.log(error);
        res.json({succes:false,message:error.message});
    }
}
export default checkApnaJobs;