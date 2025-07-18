import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaTimes } from "react-icons/fa"; // Correct icon for "X" (cross)
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css'
function Login({ login, setLogin }) {
  const [showPassword,setShowPassword]=useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLogin(true);
      navigate('/information',{state:{toastMessage:"Login Successful!"}});
  };
  const handleCross=()=>{
    setLogin(false);
    navigate('/');
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
          required
        />
        <div className='password-wrapper'>
        <input
          className="input-field"
          name="password"
          type= {showPassword?"text":"password"}
          placeholder="Your Password*"
          required
        />
        <span onClick={()=>setShowPassword(prev => !prev)}>{showPassword?<FaEyeSlash/>:<FaEye/>}</span>
        </div>
        <div className="forgot-password-box">
          <button className="forgot-password">Forgot your password?</button>
        </div>

        <button type="submit" className="submit-button" >Submit</button>
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

      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>

    </div>
  );
}

export default Login;
