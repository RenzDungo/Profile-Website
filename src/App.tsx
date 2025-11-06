import { useState } from 'react'
import './App.css'
import Navbar
 from './components/navbar'
import Home from './pages/home'
import Contact from './pages/contact'
import Projects from './pages/projects'
function App() {
  const [currentPage, setCurrentPage] = useState("Home")
  return (
    <>
      <div className='hero'>
        <Navbar setCurrentPage={setCurrentPage}/>
        <div className='pages'>
          {currentPage ==="Home" && <Home/>}
          {currentPage ==="Projects" && <Projects/>}
          {currentPage ==="Contact" && <Contact/>}
        </div>
      </div>
    </>
  )
}

export default App
