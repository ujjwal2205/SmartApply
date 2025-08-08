import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import './SignUp.css'
import {GoogleLogin } from '@react-oauth/google';
import { FaTimes } from "react-icons/fa";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
function SignUp({setLogin}) {
    const navigate = useNavigate();
    const {url,setToken,setUserData}=useContext(StoreContext);
    const [formData,setFormData]=useState(
        {
            firstName:'',
            middleName:'',
            lastName:'',
            email:'',
            password:'',
            confirmPassword:'',
        }
    )
    const [showNote,setShowNote]=useState(false);
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData(
            {
                ...formData,
                [name]:value
            }
        )
    }
    const handleCross=()=>{
    setLogin(false);
    navigate('/');
  }
   const handleSubmit = async(e) => {
      e.preventDefault();
      const response=await axios.post(url+"/api/user/signUp",formData);
      if(response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        const userData=await axios.post(url+"/api/fetch/userData",{},{
          headers:{
            Authorization: `Bearer ${response.data.token}`
          }
        })
        if(userData.data.success){
          setUserData({
            ...userData.data.data.info,
            ...userData.data.data.user
          })
          setShowNote(true);
        }
          else{
                  toast.error(userData.data.message);
                  return;
                }
        
      }
      else{
        toast.error(response.data.message);
        setLogin(false);
      }
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
                  localStorage.setItem("token",token);
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
    return (
    <>
    {showNote?
    <div className='Note-box'>
    <h1 className='Important-Note'>Important Note</h1>
    <p>
  The email address <b>{formData.email}</b> will be used for submitting job applications.
  Please confirm that this is accurate before proceeding.
</p>
    <button className='Ok' onClick={() => {setLogin(true);navigate('/information',{state:{toastMessage:"SignUp Successful!"}})}}>Ok</button>
    <button className='Cancel' onClick={()=>navigate('/')}>Cancel</button>
    </div>
    :
    <div className='sign-up-box'>
    <div className="close-button">
    <FaTimes onClick={handleCross} />
    </div>
    <h2 className='sign-up-title'>Create Account</h2>
    <form className='sign-up-form' onSubmit={handleSubmit}>
        <input onChange={handleChange}
         className='input-field'
         name="firstName"
         type="text"
         placeholder='First Name*'
         required/>
         <input onChange={handleChange}
         className='input-field'
         name="middleName"
         type="text"
         placeholder='Middle Name'/>
         <input onChange={handleChange}
         className='input-field'
         name="lastName"
         type="text"
         placeholder='Last Name*'
         required/>
         <input onChange={handleChange}
         className='input-field'
         name="email"
         type="email"
         placeholder='Your Email*'
         required/>
         <div className='password-wrapper'>
         <input onChange={handleChange}
         className='input-field'
         name="password"
         type={showPassword?"text":"password"}
         placeholder='Your Password*'
         required/>
         <span onClick={()=>setShowPassword(prev=>!prev)}>{showPassword?<FaEyeSlash/>:<FaEye/>}</span>
         </div>
         <div className='confirmPassword-wrapper'>
         <input onChange={handleChange}
         className='input-field'
         name="confirmPassword"
         type={showConfirmPassword?"text":"password"}
         placeholder='Confirm Password*'
         required/>
         <span onClick={()=>setShowConfirmPassword(prev=>!prev)}>{showConfirmPassword?<FaEyeSlash/>:<FaEye/>}</span>
         </div>
        <button type="submit" className="submit-button">Submit</button>
    </form>
    <p className="or-text">OR</p>
    <div className="google-login">
    <GoogleLogin
    onSuccess={handleSuccess}
    onError={handleError}
     />
    </div>
     <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
    }</>
  )
}

export default SignUp
