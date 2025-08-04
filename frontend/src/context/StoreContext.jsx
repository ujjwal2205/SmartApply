import React,{createContext,useState} from 'react'
export const StoreContext=createContext();
function StoreProvider(props) {
    const url="http://localhost:4000";
    const [token,setToken]=useState("");
    const contextValue={
        url,setToken
    }
  return (
    <StoreContext.Provider value={contextValue}>
        {props.children}
        </StoreContext.Provider>
  )
}

export default StoreProvider
