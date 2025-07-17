import React,{useState} from 'react'
import {Route,Routes} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import Footer from './components/Footer/Footer'
function App() {
  const [login,setLogin]=useState(false);
  return (
    <div>
      <Navbar login={login} setLogin={setLogin}/>
      <Routes>
      <Route path='/' element={<Home login={login}/>}/>
      <Route path='/about' element={<AboutUsPage/>}/>
      <Route path='/login' element={<LoginPage setLogin={setLogin} login={login}/>}/>
      <Route path='/signUp' element={<SignUpPage setLogin={setLogin}/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
