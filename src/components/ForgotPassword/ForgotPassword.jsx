import React,{useState,useEffect,useContext} from 'react'
import './ForgotPassword.css'
import { useLocation,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
function ForgotPassword() {
  const location = useLocation();
  const navigate=useNavigate();
  const{url}=useContext(StoreContext);
  const {email}=location.state ||{}
  const [otp,setOtp]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [newPassword,setNewPassword]=useState("");
  useEffect(()=>{
    try{
    if(location.state?.toastMessage){
      toast.success(location.state.toastMessage);
    }}
    catch(error){
      console.log(error);
      toast.error(error.message);
    }
  },[location,navigate])
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(newPassword.length<8){
      toast.error("Password must be at least 8 characters")
      return;
    }
    try{
    const response=await axios.post(url+"/api/OTP/Verification",{
      otp:otp,
      email:email,
      newPassword:newPassword
    })
    if(response.data.success){
      navigate('/',{state:{toastMessage:response.data.message}});
    }
    else{
      toast.error(response.data.message);
    }}
    catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }
  return (
    <div className="fp-otp-verification">
  <h1 className='fp-heading1'>OTP VERIFICATION</h1>
  <div className='fp-form'>
    <form onSubmit={handleSubmit}>
      <input
        className='fp-otp'
        type="text"
        value={otp}
        onChange={(e)=>setOtp(e.target.value)}
        maxLength={4}
        placeholder='Enter OTP'
        required
      />
      <input
        className='fp-new-password'
        name="password"
        type={showPassword ? "text" : "password"}
        value={newPassword}
        onChange={(e)=>setNewPassword(e.target.value)}
        placeholder='Enter the new Password'
        required
      />
      <span onClick={()=>setShowPassword(prev => !prev)} className="fp-toggle-password-icon">
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
      <button type="submit" className='fp-submit-button'>Submit</button>
    </form>
  </div>
</div>

  )
}

export default ForgotPassword
