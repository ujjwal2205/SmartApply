import React, { useState,useEffect } from 'react'
import './JobsInfo.css'
import {useLocation,useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
function JobsInfo() {
  const location=useLocation();
  const navigate=useNavigate();
  useEffect(() => {
      if (location.state?.toastMessage) {
        toast.success(location.state.toastMessage);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, [location,navigate]);
  const dummyJobs = [
    {
      title: "Frontend Developer",
      company: "Google",
      portal: "Naukri",
      status: "Applied"
    },
    {
      title: "Software Intern",
      company: "Internshala",
      portal: "Internshala",
      status: "Talking Stage"
    }
  ];
  const portals = [
    { name: "LinkedIn",status:true},
    { name: "Naukri", status:true},
    { name: "Internshala", status:true},
    { name: "Indeed", status:false},
  ];
  const statuses = ["Applied", "Talking Stage", "Interview Scheduled", "No Reply"];
  const [jobs,setJobs]=useState(dummyJobs);
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('All');
  const handleStatusChange=(index,newStatus)=>{
    const updatedJobs = [...jobs];
updatedJobs[index].status = newStatus;
setJobs(updatedJobs);
  }
  const filteredJobs=jobs.filter(jobs=>{
    const matchSearch=jobs.title.toLowerCase().includes(search.trim().toLowerCase())||jobs.company.toLowerCase().includes(search.trim().toLowerCase());
    const matchPortals=jobs.portal===filter||filter==='All';
    return matchSearch && matchPortals;
  })
  const handlePortalLogin=()=>{
    console.log("Redirecting");
  }
  return (
    <div className='jobsInfo'>
      <div className='topbar'>
        <div className='appliedJobsCard'>
        <h2>Total Applied Jobs:</h2>
        <h2>{filteredJobs.length}</h2>
        </div>
        <div className='portal-status'>
          {portals.map((p,i)=>
            p.status==false&&<button key={i} className='portalButtonExpired'  onClick={() => handlePortalLogin(p.name)}>{p.name} Login</button>
         )}
        </div>
      </div>
      <div className='controls'>
       <input
        type="text"
        placeholder="Search Jobs..."
        name="Search"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
       />
       <select value={filter} onChange={(e)=>setFilter(e.target.value)}>
        <option value="All">All Portals</option>
        {portals.map((p,i)=>
          <option key={i} value={p.name}>{p.name}</option>
        )}
       </select>
      </div>
      <div className='jobsTable'>
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Portal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((jobs,index)=>
             <tr key={index}>
               <td>{jobs.title}</td>
               <td>{jobs.company}</td>
               <td>{jobs.portal}</td>
               <td>
                <select value={jobs.status} onChange={(e)=>handleStatusChange(index,e.target.value)}>
                  {statuses.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                </select>
               </td>
             </tr>
            )}
            {filteredJobs.length==0 &&
            <tr>
               <td colSpan="4" style={{ textAlign: 'center' }}>No Jobs Found!</td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default JobsInfo
