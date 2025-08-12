import React,{useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FaTimes } from "react-icons/fa"; // Correct icon for "X" (cross)
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {StoreContext} from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css'
function Login({ login, setLogin }) {
  
  const [showPassword,setShowPassword]=useState(false);

  const {url,setToken,setUserData}=useContext(StoreContext);
  const [data,setData]=useState({
    email:"",
    password:""
  })
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const response=await axios.post(url+"/api/user/login",data);
    if(response.data.success){
      setLogin(true);
      setToken(response.data.token);
      localStorage.setItem("token",response.data.token);
      const userData=await axios.post(url+"/api/fetch/userData",{},{
      headers:{
        Authorization:`Bearer ${response.data.token}`
      }
      })
      if(userData.data.success){
       setUserData({
        ...userData.data.data.info,
        ...userData.data.data.user
      });
       navigate('/information',{state:{toastMessage:"Login Successful!"}});
      }
      else{
        toast.error(userData.data.message);
        return;
      }
    }
    else{
     setLogin(false);
     toast.error(response.data.message);
    }
  };
  const handleCross=()=>{
    setLogin(false);
    navigate('/');
  }
  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setData({...data,[name]:value})
  }
  const handleSuccess=async(CredentialResponse)=>{
        const token=CredentialResponse.credential;
        try{
            const response=await axios.post("http://localhost:4000/api/user/googleLogin",{
                idToken:token,
            })
            const userData=await axios.post(url+"/api/fetch/userData",{},{
            headers:{
             Authorization:`Bearer ${response.data.token}`
              }
              })
            if(response.data.status){
              setLogin(true);
              localStorage.setItem("token",response.data.token);
              setToken(response.data.token);
              if(userData.data.success){
              setUserData({
              ...userData.data.data.info,
               ...userData.data.data.user
      });
       navigate('/information',{state:{toastMessage:"Login Successful!"}});
      }
      else{
        toast.error(userData.data.message);
        return;
      }
            }
            else{
                setLogin(false);
               navigate('/');
            }
        }
        catch(error){
         console.log("Login failed",error)
         setLogin(false);
          navigate('/');
        }
    }
     const handleError = () => {
    alert("Google Sign In was unsuccessful. Try again later.");
  };
  const handleForgotPassword=async()=>{
    try {
      toast.success("Checking your email")
      const response=await axios.post(url+"/api/forgot-password/otp",{
          email:data.email
      })
      if(response.data.success){
        navigate("/forgot-password",{state:{toastMessage:response.data.message,email:data.email}});
      }
      else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  return (
    <div className="login-box">
      {/* Close button */}
      <div className="close-button">
        <FaTimes onClick={handleCross} />
      </div>

      <h2 className="login-title">WELCOME BACK</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="input-field"
          name="email"
          type="email"
          placeholder="Your Email*"
          onChange={handleChange}
          required
        />
        <div className='password-wrapper'>
        <input
          className="input-field"
          name="password"
          type= {showPassword?"text":"password"}
          placeholder="Your Password*"
          required
          onChange={handleChange}
        />
        <span onClick={()=>setShowPassword(prev => !prev)}>{showPassword?<FaEyeSlash/>:<FaEye/>}</span>
        </div>
        <div className="forgot-password-box">
          <button type="button" className="forgot-password" onClick={handleForgotPassword}>Forgot your password?</button>
        </div>

        <button type="submit" className="submit-button" >Submit</button>
      </form>

      <p className="or-text">OR</p>

      <div className="google-login">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
      </div>

      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>

    </div>
  );
}

export default Login;
