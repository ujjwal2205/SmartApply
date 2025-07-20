import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import './Information.css'
import {toast} from 'react-toastify';
import { useLocation } from 'react-router-dom';
function Information() {
    const location = useLocation();
    const navigate=useNavigate();
     useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location,navigate]);
    const MAX_FILE_SIZE = 300 * 1024; // 300 KB
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
    const portals = [
  { name: "LinkedIn",status:false},
  { name: "Naukri", status:true},
  { name: "Internshala", status:false},
  { name: "Indeed", status:true},
];
   useEffect(()=>{
    for(let i=0;i<portals.length;i++){
      if(portals[i].status==false){
        toast.error(`Alert: Your ${portals[i].name} account is not logged in. Some features may not work until you sign in!`);
      }
    }
   },[])
   const handleFileChange=(e)=>{
    const file=e.target.files[0]
    if(!file){
        return;
    }
    if(file.size>MAX_FILE_SIZE){
        toast.error("File must be less than or equal to 300 KB.");
        e.target.value=null;
        setForm(prev => ({ ...prev, resume: null}));
        return;
    }
      setForm(prev => ({ ...prev, resume: file }));
   }
   const handleSubmit=(e)=>{
    e.preventDefault();
    navigate("/dashboard/jobsInfo",{state:{toastMessage:"Applied Successfully!"}})
   }
    return (
     <div className='information-page'>   
    <div className='portals'>
      {portals.map((portal, index) => (
      <div key={index} className="portal-status">
       <b className="portal-name">{portal.name}:</b>
        {portal.status ? (
        <b className="signed-in">Signed In</b>
        ) : (
        <b className="not-signed-in">Not Signed In</b>
        )}
        </div>
        ))}
    </div>
    <h1>Your Information</h1>
    <form className='personalDetails' onSubmit={handleSubmit}>
     <input
        className='input'
        type="text"
        name="firstName"
        placeholder='First Name*'
        required
     />
     <input
        className='input'
        type="text"
        name="middleName"
        placeholder='Middle Name'
     />
     <input
        className='input'
        type="text"
        name="lastName"
        placeholder='Last Name*'
        required
     />
     <input
        className='input'
        name="location"
        type="text"
        placeholder='Enter Your Preffered Locations(comma seperated)'
     />
     <input
        className='input'
        type="text"
        name="prefferedRole"
        placeholder='Enter your preffered roles(comma seperated)*'
        required
     />
     <select name="availability" className="input" required>
          <option value="">Confirm your availability*</option>
          <option>Yes, I am available to join immediately</option>
          <option>No, I am currently on notice period</option>
          <option>No, I will have to serve notice period</option>
        </select>
        <select name="experience" className="input" required>
          <option value="">Do you have prior experience?*</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <select name="workFromHome" className="input" required>
          <option value="Yes">Open to Work From Home?</option>
          <option>Yes</option>
          <option>No</option>
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
       required
       />
       {form.resume && (
       <div className="resumePreview">
        📄 {form.resume.name}
       <button
       type="button"
       className="viewBtn"
       onClick={() => {
       const fileURL = URL.createObjectURL(form.resume);
       window.open(fileURL, '_blank');
       }}
       >
       View
      </button>
      </div>
      )}
       <p className="resumeNote">Upload resume in PDF only. Max size: 300 KB</p>
      </div>
       <textarea
        name="about"
        placeholder='Tell me about yourself*'
        className='textArea'
        required
       />
       <textarea name="whyHire" placeholder="Why should we hire you?*"  className="textArea" required />
       <button type="submit" className='button'>Save & Continue</button>
    </form>
    </div>
  )
}

export default Information
