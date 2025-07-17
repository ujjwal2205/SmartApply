import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { Link} from "react-router-dom";

function Navbar({ login, setLogin }) {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  },[]);

  const toggleDropdown = () => setDropdown((prev) => !prev);

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
          <div className="user-menu" ref={dropdownRef}>
            <div className="user-icon" onClick={toggleDropdown}>
              <FaUserCircle />
            </div>
            <div className={`user-dropdown ${dropdown ? "show" : ""}`}>
              <Link to="/dashboard" onClick={()=>setDropdown(false)}>Dashboard</Link>
              <Link to="/" className="logout-btn" onClick={() => setLogin(false)}>Logout</Link>
            </div>
          </div>
        ) : (
          <a className="get-started-button" href="/login">Get Started</a>
        )}
      </div>
    </div>
  );
}

export default Navbar;
