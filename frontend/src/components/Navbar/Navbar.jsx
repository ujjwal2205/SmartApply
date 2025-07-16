import React, { useState } from "react";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({ login, setLogin }) {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  return (
    <div className="navbar">
      <a href="/" className="navbar-logo">
        <h1 className="logo">SmartApply</h1>
      </a>

      <div className="nav-center">
        <div className="nav-links">
          <Link to="/#why-smartapply"><h2>Why SmartApply</h2></Link>
          <Link to="/about"><h2>About Us</h2></Link>
          <a href="#footer"><h2>Contact Us</h2></a>
        </div>
      </div>

      <div className="nav-auth">
        {login ? (
          <div className="user-menu">
            <div className="user-icon" onClick={toggleDropdown}>
              <FaUserCircle />
            </div>
            {dropdown && (
              <div className="user-dropdown">
                <Link to="/dashboard">Dashboard</Link>
                <button className="logout-btn" onClick={()=>setLogin(false)}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="get-started-button" onClick={()=>setLogin(true)}>Get Started</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
