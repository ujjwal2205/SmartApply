import React from "react";
import "./MiniAbout.css";

const MiniAbout = () => {
  return (
    <section className="about-mini">
      <div className="about-container">
        <h2 className="about-heading">Our Mission</h2>
        <p className="about-text">
          We started SmartApply with one goal — to make job hunting effortless using AI. 
          Whether you're a fresher or an experienced professional, our mission is to help you 
          get hired faster, smarter, and stress-free.
        </p>
        <a href="/about" className="about-link">Learn more →</a>
      </div>
    </section>
  );
};

export default MiniAbout;
