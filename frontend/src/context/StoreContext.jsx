import React,{createContext,useState} from 'react'
export const StoreContext=createContext();
function StoreProvider(props) {
    const url="http://localhost:4000";
    const automation="http://localhost:5000";
    const [token,setToken]=useState("");
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
    const contextValue={
        url,setToken,token,userData,setUserData,portals,setPortals,automation
    }
  return (
    <StoreContext.Provider value={contextValue}>
        {props.children}
        </StoreContext.Provider>
  )
}

export default StoreProvider
