import React,{useEffect} from 'react';
import './Header.css';
import heroImage from '../../assets/auto-apply-hero.png';
import { useLocation} from 'react-router-dom';
import { toast } from 'react-toastify';
import {Link} from "react-router-dom";
function Header({login}) {
  const location=useLocation();
  useEffect(()=>{
      try{
      if(location.state?.toastMessage){
        toast.success(location.state.toastMessage);
      }}
      catch(error){
        console.log(error);
        toast.error(error.message);
      }
    },[location])
  return (
    <main className="hero">
      {/* Left Content */}
      <div className="hero-content">
        <h1>
          Automate Your Job Hunt <br /> with <span className="highlight">Automation</span>
        </h1>
        <p>
          SmartApply finds and applies to jobs that match your resume, skills, and preferences —
          saving you time and boosting your interview chances.
        </p>
        {login?
        <Link className="hero-btn" to="/information">
          Start Applying →
        </Link>:
        <Link className="hero-btn" to="/login">
          Start Applying →
        </Link>}

        <div className="tagline">
          ⚡ Built with Automation · Real-time Tracking
        </div>
      </div>

      {/* Right Image */}
      <div className="hero-image-container">
        <div className="glass-bg" aria-hidden="true"></div>
        <img
          src={heroImage}
          alt="SmartApply job automation dashboard preview"
          className="hero-image"
          loading="lazy"
        />
      </div>
    </main>
  );
}

export default Header;
