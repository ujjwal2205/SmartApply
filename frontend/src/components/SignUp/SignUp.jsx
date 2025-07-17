import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './SignUp.css'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaTimes } from "react-icons/fa";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
function SignUp({setLogin}) {
    const navigate = useNavigate();
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
   const handleSubmit = (e) => {
      e.preventDefault();
       setShowNote(true);
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
    <button className='Ok' onClick={() => {setLogin(true);navigate('/information')}}>Ok</button>
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
         placeholder='First Name'
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
         placeholder='Last Name'
         required/>
         <input onChange={handleChange}
         className='input-field'
         name="email"
         type="email"
         placeholder='Your Email'
         required/>
         <div className='password-wrapper'>
         <input onChange={handleChange}
         className='input-field'
         name="password"
         type={showPassword?"text":"password"}
         placeholder='Your Password'
         required/>
         <span onClick={()=>setShowPassword(prev=>!prev)}>{showPassword?<FaEyeSlash/>:<FaEye/>}</span>
         </div>
         <div className='confirmPassword-wrapper'>
         <input onChange={handleChange}
         className='input-field'
         name="confirmPassword"
         type={showConfirmPassword?"text":"password"}
         placeholder='Confirm Password'
         required/>
         <span onClick={()=>setShowConfirmPassword(prev=>!prev)}>{showConfirmPassword?<FaEyeSlash/>:<FaEye/>}</span>
         </div>
        <button type="submit" className="submit-button">Submit</button>
    </form>
    <p className="or-text">OR</p>
    <div className="google-login">
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <GoogleLogin
    onSuccess={(res) => console.log(res)}
    onError={() => console.log("Login Failed")}
     />
    </GoogleOAuthProvider>
    </div>
     <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
    }</>
  )
}

export default SignUp
