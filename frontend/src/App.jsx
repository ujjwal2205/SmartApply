import React,{useState} from 'react'
import {Route,Routes} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage'
import Footer from './components/Footer/Footer'
function App() {
  const [login,setLogin]=useState(true);
  return (
    <div>
      <Navbar login={login} setLogin={setLogin}/>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<AboutUsPage/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
