import React,{useState,useEffect,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import './Information.css'
import {toast} from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Select from 'react-select'
import cityOptions from '../../../cities.json'
import axios from "axios";
import { StoreContext } from '../../context/StoreContext';
function Information() {
  const [spinner,setSpinner]=useState(true);
  const preferredRoles = [
  { value: "frontend_developer", label: "Frontend Development" },
  { value: "backend_developer", label: "Back end Development" },
  { value: "fullstack_developer", label: "Full Stack Development" },
  { value: "software_engineer", label: "Software Development" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "data_scientist", label: "Data Science" },
  { value: "machine_learning_engineer", label: "Machine Learning" },
  { value: "android_developer", label: "Android App Development" },
  { value: "ios_developer", label: "iOS App Development" },
  { value: "devops_engineer", label: "DevOps Engineer" },
  { value: "ui_ux_design", label: "UI/UX Design" },
  { value: "cloud_engineer", label: "Cloud Computing" },
  { value: "qa_engineer", label: "Software Testing" },
  { value: "product_management", label: "Product Management" },
  { value: "business_development", label: "Business Development" },
  { value: "blockchain_development", label: "Blockchain Development" },
  { value: "game_development", label: "Game Development" },
  { value: "Cyber_Security", label: "Cyber Security" },
];
    const {url,token,userData,setUserData,portals,setPortals,automation}=useContext(StoreContext);
    const location = useLocation();
    const navigate=useNavigate();
     useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location,navigate]);
    const MAX_FILE_SIZE = 300 * 1024; // 300 KB
    
    const checkSessions=async()=>{
      try{
    setSpinner(true);
    const apnaJobs=await axios.post(`${automation}/apply/ApnaJobsCheck`);
    if(apnaJobs.data.success){
      setPortals(prev=>({...prev,ApnaJobs:true}));
    }
    else{
        setPortals(prev=>({...prev,ApnaJobs:false}));
    }
    const internshala=await axios.post(`${automation}/apply/InternshalaCheck`);
    if(internshala.data.success){
      setPortals(prev=>({...prev,Internshala:true}));
    }
    else{
      setPortals(prev=>({...prev,Internshala:false}));
    }
    const naukri=await axios.post(`${automation}/apply/NaukriCheck`);
    if(naukri.data.success){
      setPortals(prev=>({...prev,Naukri:true}));
    }
    else{
      setPortals(prev=>({...prev,Naukri:false}));
    }}
     catch(error){
      console.log(error);
     }
    finally {
      setSpinner(false);
    }};
   useEffect(()=>{
     checkSessions();
   },[])
   useEffect(()=>{
    if(spinner==false){
     Object.entries(portals).forEach(([portal, status])=>{
      if(status==false){

        toast.error(`Alert: Your ${portal} account is not logged in.Please click on the button for sign in.`);
       }
   });
}},[spinner])
   const handleFileChange=(e)=>{
    const file=e.target.files[0]
    if(!file){
        return;
    }
    if(file.size>MAX_FILE_SIZE){
        toast.error("File must be less than or equal to 300 KB.");
        e.target.value=null;
        setUserData(prev => ({ ...prev, resume: null}));
        return;
    }
      setUserData(prev => ({ ...prev, resume: file }));
   }
   const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("firstName",userData.firstName);
    formData.append("middleName",userData.middleName);
    formData.append("lastName",userData.lastName);
    formData.append("location",userData.location);
    formData.append("preferredRole",userData.preferredRole);
    formData.append("workFromHome",userData.workFromHome);
    formData.append("whyHire",userData.whyHire);
    if(userData.resume instanceof File){
    formData.append("resume",userData.resume);
    }
    else if (userData.resume.data.data) {
      // Case 2: Resume from DB (Buffer data)
      const byteArray = new Uint8Array(userData.resume.data.data);
      const blob = new Blob([byteArray], { type: userData.resume.contentType || 'application/pdf' });
      formData.append("resume",blob,userData.resume.name);
    }
    const response=await axios.post(url+"/api/information",formData,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    if(response.data.success){
      navigate("/dashboard/jobsInfo",{state:{toastMessage:"Applied Successfully!"}})
    }
    else{
      toast.error(response.data.message);
    }
   }
   const handleChange=(selectedOption)=>{
    setUserData(prev=>({...prev,location:selectedOption.label}));
   }
   const options = 
    cityOptions
    .map((city)=>({
      value:city.name,
      label:city.name,
    })).sort((a, b) => a.label.localeCompare(b.label));
    const handleChangePrefferedRoles=(selectedOption)=>{
      setUserData(prev=>({...prev,preferredRole:selectedOption.label}));
    }
    const handleTextChange=(e)=>{
      const name=e.target.name;
      const value=e.target.value;
      setUserData(prev=>({...prev,[name]:value}));
    }
    const handleClick=async(name)=>{
      const response=await axios.post(automation+"/apply/"+name+"Login");
      try{
      if(response.data.success){
        toast.success(response.data.message);
        checkSessions();
      }
      else{
        toast.error(response.data.message);
      }
    }
    catch(error){
      console.log(error);
      toast.error(error.message);
    }
    }
    return (
      spinner?<div className="spinner-container">
        <div className="spinner"></div>
        <p className="spinner-text">
        Checking your login sessions across all job portals. This may take a few seconds...
        </p>
      </div>:(<>
     <div className='information-page'>   
    <div className='portals'>
      {Object.entries(portals).map((([portal, status]) => (
      !status&&<button key={portal} className='portalExpiredButton' onClick={()=>handleClick(portal)}>{portal} Login</button>
        )))}
    </div>
    <h1>Your Information</h1>
    <form className='personalDetails' onSubmit={handleSubmit}>
     <input
        className='input'
        type="text"
        name="firstName"
        placeholder='First Name*'
        onChange={handleTextChange}
        value={userData.firstName}
        required
     />
     <input
        className='input'
        type="text"
        name="middleName"
        placeholder='Middle Name'
        onChange={handleTextChange}
        value={userData.middleName}
     />
     <input
        className='input'
        type="text"
        name="lastName"
        placeholder='Last Name*'
        onChange={handleTextChange}
        value={userData.lastName}
        required
     />
     <Select
        options={options}
        onChange={handleChange}
        isSearchable={true}
        placeholder='e.g Delhi'
     />
     <Select
        options={preferredRoles.sort((a,b)=>a.label.localeCompare(b.label))}
        onChange={handleChangePrefferedRoles}
        isSearchable={true}
        placeholder='Enter your preffered roles*'
        required
     />
        <select name="workFromHome" className="input" onChange={handleTextChange} >
          <option value="Yes">Open to Work From Home?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          
        </select>
        <div className="resumeUpload">
       <label className="resumeLabel" htmlFor="resume">
        Upload Resume
       </label>
      <input
       type="file"
       id="resume"
       accept=".pdf"
       onChange={handleFileChange}
       className="input resumeInput"
       required={!userData.resume}
       />
       {userData.resume && (
       <div className="resumePreview">
        📄 {userData.resume.name}
       <button
       type="button"
       className="viewBtn"
       onClick={() => {
        if (userData.resume instanceof File) {
        // Case 1: Freshly uploaded resume
        const fileURL = URL.createObjectURL(userData.resume);
        window.open(fileURL, '_blank');
       } else if (userData.resume.data.data) {
      // Case 2: Resume from DB (Buffer data)
      const byteArray = new Uint8Array(userData.resume.data.data);
      const blob = new Blob([byteArray], { type: userData.resume.contentType || 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    }
       }}
       >
       View
      </button>
      </div>
      )}
       <p className="resumeNote">Upload resume in PDF only. Max size: 300 KB</p>
      </div>
       <textarea name="whyHire" value={userData.whyHire} onChange={handleTextChange} placeholder="Mention in detail what relevant skill or past experience you have for the internship. What excites you about the internship?*"  className="textArea" required />
       <button type="submit" className='button'>Save & Continue</button>
    </form>
    </div>
    </>
  ))
}

export default Information
