import React, { useState, useEffect, useContext } from 'react';
import './JobsInfo.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

function JobsInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const { portals, token, automation, url, jobs, setJobs } = useContext(StoreContext);
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchJobsData = async () => {
    try {
      const response = await axios.post(`${url}/api/Jobs/fetchJobs`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setJobs(response.data.data);
    } catch (error) {
      toast.error("Error connecting to data server");
    }
  };

  useEffect(() => {
    if (location.state?.toastMessage) {
      const initAutomation = async () => {
        setSpinner(true);
        try {
          const promises = Object.entries(portals).map(([p, status]) => 
            status ? axios.post(`${automation}/apply/${p}`, {}, { headers: { Authorization: `Bearer ${token}` }}) : null
          );
          await Promise.all(promises);
          // Send email after automation completes
          try {
            const emailResponse = await axios.post(`${url}/api/currJobs/fetch`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (emailResponse.data.success) {
              toast.success(emailResponse.data.message);
            } else {
              toast.error(emailResponse.data.message);
            }
          } catch (error) {
            toast.error("Failed to send email");
          }
          await fetchJobsData();
          toast.success(location.state.toastMessage);
          navigate(location.pathname, { replace: true, state: {} });
        } finally {
          setSpinner(false);
        }
      };
      initAutomation();
    } else {
      fetchJobsData();
    }
  }, []);

  const updateStatus = async (jobId, newStatus) => {
    try {
      await axios.post(`${url}/api/dashboard/updateStatus`, { jobId, status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.jobTitle.toLowerCase().includes(search.toLowerCase()) || 
                        job.company.toLowerCase().includes(search.toLowerCase());
    const matchPortal = filter === 'All' || job.portal === filter;
    const matchStatus = statusFilter === "All" || job.status === statusFilter;
    
    const jobDate = new Date(job.appliedDate);
    const start = fromDate ? new Date(fromDate + "T00:00:00") : null;
    const end = toDate ? new Date(toDate + "T23:59:59") : null;

    let matchDate = true;
    if (start && jobDate < start) matchDate = false;
    if (end && jobDate > end) matchDate = false;

    return matchSearch && matchPortal && matchStatus && matchDate;
  });

  return (
    <div className='jobsInfo'>
      {spinner ? (
        <div className='spinner-container'>
          <div className='spinner'></div>
          <p style={{marginTop: '16px', color: '#64748b', fontSize: '0.9rem'}}>Processing Automated Applications...</p>
        </div>
      ) : (
        <>
          <div className='topbar'>
            <div>
              <h1 style={{fontSize: '1.5rem', fontWeight: '700', margin: 0}}>Job Applications</h1>
              <p style={{color: '#64748b', fontSize: '0.85rem', marginTop: '4px'}}>Manage and track your career opportunities.</p>
            </div>
            <div className='appliedJobsCard'>
              <h2>Total Applications</h2>
              <span className='count-badge'>{filteredJobs.length}</span>
            </div>
          </div>

          <div className='controls-container'>
            <div className='filter-row'>
              <input 
                className='search-input'
                type="text" 
                placeholder="Search by title, company or keyword..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className='filter-select' value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All Portals</option>
                {Object.keys(portals).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select className='filter-select' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                {["Applied", "Interviewed", "Selected", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className='date-filter-group'>
              <span className='date-label'>DATE RANGE</span>
              <div className='date-picker-box'>
                <label>From</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <span style={{color: '#cbd5e1'}}>—</span>
              <div className='date-picker-box'>
                <label>To</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
              { (fromDate || toDate) && (
                <button 
                  onClick={() => {setFromDate(''); setToDate('');}}
                  style={{marginLeft: 'auto', background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer'}}
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          <div className='jobsTable'>
            <table>
              <thead>
                <tr>
                  <th>Designation & Company</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr key={job._id}>
                      <td className='job-cell'>
                        <b>{job.jobTitle}</b>
                        <span>{job.company}</span>
                      </td>
                      <td>
                        <span style={{fontWeight: '500', color: '#475569'}}>{job.portal}</span>
                      </td>
                      <td>
                        <select 
                          className={`status-dropdown status-${job.status.toLowerCase()}`}
                          value={job.status}
                          onChange={(e) => updateStatus(job._id, e.target.value)}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interviewed">Interviewed</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{color: '#64748b', fontSize: '0.85rem', fontWeight: '500'}}>
                        {new Date(job.appliedDate).toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '48px', color: '#94a3b8'}}>
                      No application records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default JobsInfo;