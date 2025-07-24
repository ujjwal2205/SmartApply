import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    middleName:{type:String},
    lastName:{type:String,required:true},
    email:{type:String,unique:true,required:true,lowercase:true},
    password:{type:String,required:true}
})
const userModel=mongoose.models.user || mongoose.model("user",userSchema);
export default userModel