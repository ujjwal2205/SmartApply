import React from 'react';
import './Header.css';
import heroImage from '../../assets/auto-apply-hero.png';

function Header({login}) {
  return (
    <main className="hero">
      {/* Left Content */}
      <div className="hero-content">
        <h1>
          Automate Your Job Hunt <br /> with <span className="highlight">AI Precision</span>
        </h1>
        <p>
          SmartApply finds and applies to jobs that match your resume, skills, and preferences —
          saving you time and boosting your interview chances.
        </p>
        {login?
        <a href="/information" className="hero-btn">
          Start Applying →
        </a>:
        <a href="/login" className="hero-btn">
          Start Applying →
        </a>}

        <div className="tagline">
          ⚡ Built with AI · Automation · Real-time Tracking
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
