import React from 'react'
import './Sidebar.css'
import {FaUserEdit,FaBriefcase} from "react-icons/fa";
import { NavLink } from 'react-router-dom';
function Sidebar() {
  return (
    <div className='sidebar'>
    <NavLink to="/dashboard/jobsInfo" className={({ isActive }) => isActive ? "active-tab" : ""}>
     <div className='jobsInfoLink'>
        <FaBriefcase/>
        <p>Jobs Info</p>
     </div>
     </NavLink>
     <NavLink to="/dashboard/editInformation" className={({ isActive }) => isActive ? "active-tab" : ""}>
     <div className='userInfo'>
        <FaUserEdit/>
        <p>User Info</p>
     </div>
     </NavLink>
    </div>
  )
}

export default Sidebar
