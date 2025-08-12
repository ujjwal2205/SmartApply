import React, { useState,useEffect,useContext } from 'react'
import './JobsInfo.css'
import {useLocation,useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
function JobsInfo() {
  const location=useLocation();
  const navigate=useNavigate();
  const [spinner,setSpinner]=useState(false);
  const [flag,setFlag]=useState(true);
  const {portals,setPortals,token,automation,url,jobs,setJobs}=useContext(StoreContext);
  useEffect(()=>{
      const runJobs=async()=>{
      setSpinner(true);
    try{
      const promise=Object.entries(portals).map(([portal,status])=>{
        if(status===true){
          return applyJob(portal);
        }
      })
      await Promise.all(promise);
       const response=await axios.post(`${url}/api/Jobs/fetchJobs`,{},{
         headers:{
             Authorization:`Bearer ${token}`
           }
       });
       if(response.data.success){
         setJobs(response.data.data);
       }
       else{
         console.log(response.data.message);
         toast.error(response.data.message);
       }
     }
     catch(error){
       console.log(error);
       toast.error(error.message);
      }finally{
        try{
        const response=await axios.post(url+"/api/currJobs/fetch",{},{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        if(response.data.success){
          toast.success(response.data.message);
        }
        else{
        toast.error(response.data.message);
        }}
        catch(error){
         console.log(error);
         toast.error(error.message);
        }finally{
        setSpinner(false);
        setFlag(false); 
      }}
    }
    const fetchJobsOnly=async()=>{
      setSpinner(true);
      try {
        const response=await axios.post(`${url}/api/Jobs/fetchJobs`,{},{
         headers:{
             Authorization:`Bearer ${token}`
           }
       });
       if(response.data.success){
         setJobs(response.data.data);
       }
       else{
         console.log(response.data.message);
         toast.error(response.data.message);
       }
     }
     catch(error){
       console.log(error);
       toast.error(error.message);

      }finally{
        setSpinner(false);
      }
    };
      if(location.state?.toastMessage){
      runJobs();
      }
      else{
        fetchJobsOnly();
      }
    ;
  }
  ,[]);
  useEffect(() => {
      if(flag===false){
      if (location.state?.toastMessage) {
        toast.success(location.state.toastMessage);
        navigate(location.pathname, { replace: true, state: {} });
      }}
    }, [location,navigate,flag]);
  const applyJob=async(portal)=>{
    try{
      await axios.post(`${automation}/apply/${portal}`,{},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
    }
    catch(error){
      console.log(error);
    }
  }
  
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('All');
  const filteredJobs=jobs.filter(jobs=>{
    const matchSearch=jobs.jobTitle.toLowerCase().includes(search.trim().toLowerCase())||jobs.company.toLowerCase().includes(search.trim().toLowerCase());
    const matchPortals=jobs.portal===filter||filter==='All';
    return matchSearch && matchPortals;
  })
  
  return (
    spinner?<div className='spinner-container'>
      <div className='spinner'>
      </div>
        <p className='"spinner-text"'>
          We’re applying for jobs on your behalf — sit tight, this won’t take long!
        </p>
    </div>:(<>
    <div className='jobsInfo'>
      <div className='topbar'>
        <div className='appliedJobsCard'>
        <h2>Total Applied Jobs:</h2>
        <h2>{filteredJobs.length}</h2>
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
        {Object.entries(portals).map(([portal,status])=>(
          <option key={portal} value={portal}>{portal}</option>
        ))
        }
       </select>
      </div>
      <div className='jobsTable'>
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Portal</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((jobs,index)=>
             <tr key={index}>
               <td>{jobs.jobTitle}</td>
               <td>{jobs.company}</td>
               <td>{jobs.portal}</td>
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
    </>)
  )
}

export default JobsInfo
