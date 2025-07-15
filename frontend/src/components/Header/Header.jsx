import React from 'react';
import './Header.css';
import heroImage from '../../assets/auto-apply-hero.png';

function Header() {
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
        <button className="hero-btn" aria-label="Start Applying Now">
          Start Applying →
        </button>

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
