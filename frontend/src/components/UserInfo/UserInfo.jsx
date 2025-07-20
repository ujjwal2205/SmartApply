import React,{useState} from 'react'
import './UserInfo.css'
import {toast } from 'react-toastify'
function UserInfo() {
  const MAX_FILE_SIZE = 300 * 1024; 
  const [form,setForm] = useState({
      firstName: "",
      middleName: "",
      lastName: "",
      location: "",
      preferredRole: "",
      availability: "",
      experience: "",
      workFromHome: "Yes",
      about: "",
      whyHire: "",
      resume: null,
    });
    const handleFileChange=(e)=>{
    const file=e.target.files[0]
    if(!file){
        return;
    }
    if(file.size>MAX_FILE_SIZE){
        toast.error("File must be less than or equal to 300 KB.");
        e.target.value=null;
        setForm(prev => ({ ...prev, resume: null }));
        return;
    }
      setForm(prev => ({ ...prev, resume: file }));
   }
  const handleSubmit=(e)=>{
    e.preventDefault();
  toast.success("Your Information is saved!")
  }
  return (
    <div>
      <h1 className='userInfo-formHeading'>Edit Your Information</h1>
<form className='userInfo-form' onSubmit={handleSubmit}>
  <input className='userInfo-input' type="text" name="firstName" placeholder='First Name*' required />
  <input className='userInfo-input' type="text" name="middleName" placeholder='Middle Name' />
  <input className='userInfo-input' type="text" name="lastName" placeholder='Last Name*' required />
  <input className='userInfo-input' name="location" type="text" placeholder='Enter Your Preferred Locations (comma separated)' />
  <input className='userInfo-input' type="text" name="preferredRole" placeholder='Enter your preferred roles (comma separated)*' required />
  
  <select name="availability" className="userInfo-input" required>
    <option value="">Confirm your availability*</option>
    <option>Yes, I am available to join immediately</option>
    <option>No, I am currently on notice period</option>
    <option>No, I will have to serve notice period</option>
  </select>
  
  <select name="experience" className="userInfo-input" required>
    <option value="">Do you have prior experience?*</option>
    <option>Yes</option>
    <option>No</option>
  </select>

  <select name="workFromHome" className="userInfo-input" required>
    <option value="Yes">Open to Work From Home?</option>
    <option>Yes</option>
    <option>No</option>
  </select>

  <div className="userInfo-resumeUpload">
    <label className="userInfo-resumeLabel" htmlFor="resume">Upload Resume</label>
    <input type="file" id="resume" accept=".pdf" onChange={handleFileChange} className="userInfo-input userInfo-resumeInput" required />
    
    {form.resume && (
      <div className="userInfo-resumePreview">
        📄 {form.resume.name}
        <button type="button" className="userInfo-viewBtn" onClick={() => {
          const fileURL = URL.createObjectURL(form.resume);
          window.open(fileURL, '_blank');
        }}>
          View
        </button>
      </div>
    )}

    <p className="userInfo-resumeNote">Upload resume in PDF only. Max size: 300 KB</p>
  </div>

  <textarea name="about" placeholder='Tell me about yourself*' className='userInfo-textArea' required />
  <textarea name="whyHire" placeholder="Why should we hire you?*" className="userInfo-textArea" required />
  
  <button type="submit" className='userInfo-button'>Save Information</button>
</form>

    </div>
  )
}

export default UserInfo
