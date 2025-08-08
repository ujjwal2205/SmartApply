import naukriLogin from "../login/naukriLogin.js";
const checkNaukriLogin=async(req,res)=>{
 try{
 const result=await naukriLogin();
 if(result.success){
    res.json({success:true,message:result.message});
}
else{
res.json({success:false,message:result.message});
}
 }
 catch(error){
    console.log(error);
        res.json({success:false,message:error.message})
 }
}
export default checkNaukriLogin;