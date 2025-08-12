import React,{createContext,useEffect,useState} from 'react'
export const StoreContext=createContext();
import axios from "axios";
function StoreProvider(props) {
    const url="https://smartapply-backend-9mmb.onrender.com";
    const automation="https://smartapply-automation.onrender.com";
    const [token,setToken]=useState(()=>localStorage.getItem("token")||"");
    const [jobs,setJobs]=useState([]);
    const [userData,setUserData]=useState({
      firstName:"",
      middleName:"",
      lastName:"",
      location:"",
      preferredRole:"",
      workFromHome:"",
      whyHire:"",
      resume:null,
    })
    const [portals,setPortals] = useState(
  {"ApnaJobs":false,
  "Naukri":false,
  "Internshala":false}
);
   useEffect(()=>{
    const DatabaseValues=async()=>{
    const response=await axios.post(url+"/api/fetch/userData",{},{
    headers:{
        Authorization:`Bearer ${token}`
      }})
      if(response.data.success){
        setUserData({
          ...response.data.data.info,
        ...response.data.data.user
        })
      }
   }
   DatabaseValues();
  }
  ,[]);
  
    const contextValue={
        url,setToken,token,userData,setUserData,portals,setPortals,automation,jobs,setJobs
    }
  return (
    <StoreContext.Provider value={contextValue}>
        {props.children}
        </StoreContext.Provider>
  )
}

export default StoreProvider
