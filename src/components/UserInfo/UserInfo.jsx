import React,{useState,useContext} from 'react'
import './UserInfo.css'
import {toast } from 'react-toastify'
import axios from "axios";
import { StoreContext } from '../../context/StoreContext';
function UserInfo() {
  const MAX_FILE_SIZE = 300 * 1024; 
  const {userData,url,setUserData,token}=useContext(StoreContext);
    const handleFileChange=(e)=>{
    const file=e.target.files[0]
    if(!file){
        return;
    }
    if(file.size>MAX_FILE_SIZE){
        toast.error("File must be less than or equal to 300 KB.");
        e.target.value=null;
        setUserData(prev => ({ ...prev, resume: null }));
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
  toast.success("Your Information is saved!")
    }
    else{
      toast.error(response.data.message);
    }
  }
  const handleTextChange=(e)=>{
      const name=e.target.name;
      const value=e.target.value;
      setUserData(prev=>({...prev,[name]:value}));
    }
  return (
    <div>
      <h1 className='userInfo-formHeading'>Edit Your Information</h1>
<form className='userInfo-form' onSubmit={handleSubmit}>
  <input className='userInfo-input' type="text" name="firstName" placeholder='First Name*' value={userData.firstName} onChange={handleTextChange} required />
  <input className='userInfo-input' type="text" name="middleName" placeholder='Middle Name' value={userData.middleName} onChange={handleTextChange}/>
  <input className='userInfo-input' type="text" name="lastName" placeholder='Last Name*' value={userData.lastName} onChange={handleTextChange} required />
  <div className="userInfo-resumeUpload">
    <label className="userInfo-resumeLabel" htmlFor="resume">Upload Resume</label>
    <input type="file" id="resume" accept=".pdf" onChange={handleFileChange} className="userInfo-input userInfo-resumeInput" required={!userData.resume} />
    
    {userData.resume && (
      <div className="userInfo-resumePreview">
        📄 {userData.resume.name}
        <button type="button" className="userInfo-viewBtn" 
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
       }}>
          View
        </button>
      </div>
    )}
    <p className="userInfo-resumeNote">Upload resume in PDF only. Max size: 300 KB</p>
  </div>

  <textarea name="whyHire" onChange={handleTextChange} placeholder="Mention in detail what relevant skill or past experience you have for the internship. What excites you about the internship?*" className="userInfo-textArea" value={userData.whyHire} required />
  
  <button type="submit" className='userInfo-button'>Save Information</button>
</form>

    </div>
  )
}

export default UserInfo
