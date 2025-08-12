import React from 'react'
import './Dashboard.css'
import Sidebar from './components/Sidebar/Sidebar'
import JobsInfoPage from './pages/JobsInfoPage/JobsInfoPage'
import {Outlet} from 'react-router-dom';
import { Route,Routes } from 'react-router-dom';
function Dashboard() {
   return (
    <div className="dashboard-container"> 
      <Sidebar />
      <div className="dashboard-content"> 
        <Outlet />
      </div>
    </div>
  );
  
}

export default Dashboard
