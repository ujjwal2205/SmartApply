import internshalaCheck from "../checkSession/internshalaCheck.js"
const checkInternshala=async(req,res)=>{
    try {
        const result=await internshalaCheck();
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
export default checkInternshala;