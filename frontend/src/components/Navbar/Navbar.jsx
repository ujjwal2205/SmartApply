import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <h1 className="logo">SmartApply</h1>

      <div className="nav-links">
        <h2>Why SmartApply</h2>
        <h2>About Us</h2>
        <h2>Contact Us</h2>
      </div>

      <button className="get-started-button">Get Started</button>
    </div>
  );
}

export default Navbar;
