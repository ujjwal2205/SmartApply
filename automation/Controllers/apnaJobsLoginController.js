import apnaJobsLogin from "../login/apnaJobsLogin.js";
const checkApnaJobsLogin=async(req,res)=>{
    try{
        const result=await apnaJobsLogin();
        if(result.success){
            res.json({success:true,message:"Logged In"});
        }
        else{
            res.json({success:false,message:"Not logged In"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
export default checkApnaJobsLogin;