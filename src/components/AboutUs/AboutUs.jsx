import React from 'react'
import './AboutUs.css'
function AboutUs() {
  return (
    <div>
       <section className="about-us">
      <div className="about-wrapper">
        <h2 className="about-heading">About SmartApply</h2>
        <p className="about-subtext">
          SmartApply is built with one mission — to make your job hunt faster,
          smarter, and stress-free. Whether you're a fresher or a working
          professional, we help you get noticed by the right companies through
          automation and intelligence.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h4>🚀 Our Mission</h4>
            <p>
              To simplify job search by leveraging AI — from resume matching to
              automated applications.
            </p>
          </div>
          <div className="about-card">
            <h4>🤖 How We Work</h4>
            <p>
              We analyze job descriptions, match them with your resume, and
              apply with personalized documents — all on autopilot.
            </p>
          </div>
          <div className="about-card">
            <h4>🔒 Privacy First</h4>
            <p>
              Your data is encrypted and 100% private. You're in full control
              of your career journey.
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default AboutUs
