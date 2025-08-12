import jwt from 'jsonwebtoken';


const authMiddleware=async(req,res,next)=>{
    const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.json({success:false,message:"Not Authorized.Login Again!"});
}
const token=authHeader.split(" ")[1];
if(!token){
    return res.json({success:false,message:"Not Authorized Login Agian"});
}
try {
    const token_decode=jwt.verify(token,process.env.JWT_SECRET);
    req.body = req.body || {};
    req.body.email=token_decode.email;
    next();
} catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
}
}
export default authMiddleware
