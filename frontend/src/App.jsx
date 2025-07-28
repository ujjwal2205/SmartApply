import React,{useState} from 'react'
import { ToastContainer } from 'react-toastify';
import {Route,Routes} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import InformationPage from './pages/InformationPage/InformationPage'
import Footer from './components/Footer/Footer'
import Dashboard from '../src/Dashboard';
import JobsInfoPage from './pages/JobsInfoPage/JobsInfoPage';
import UserInfoPage from './pages/UserInfoPage/UserInfoPage';

function App() {
  const [login,setLogin]=useState(false);
  return (
    <div>
      <ToastContainer />
      <Navbar login={login} setLogin={setLogin}/>
      <Routes>
      <Route path='/' element={<Home login={login}/>}/>
      <Route path='/about' element={<AboutUsPage/>}/>
      <Route path='/login' element={<LoginPage setLogin={setLogin} login={login}/>}/>
      <Route path='/signUp' element={<SignUpPage setLogin={setLogin}/>}/>
      <Route path='/information' element={<InformationPage/>}/>
      <Route path='/dashboard' element={<Dashboard/>}>
       <Route path="jobsInfo" element={<JobsInfoPage />} />
       <Route path="editInformation" element={<UserInfoPage/>}/>
       </Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
