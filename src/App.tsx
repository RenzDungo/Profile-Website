import { useState } from 'react'
import Navigationbar from './components/Navbar'
import Home from './Pages/Home'
import Projectpage from './Pages/Projects'
import ContactPage from './Pages/Contact'

function App() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="pcb-app">
      <Navigationbar
        onHome={() => setActiveIndex(0)}
        onProjects={() => setActiveIndex(1)}
        onContact={() => setActiveIndex(2)}
      />
      <div className="pcb-viewport">
        <div
          className="pcb-track"
          style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}
        >
          <div className="pcb-page">
            <Home />
          </div>
          <div className="pcb-page">
            <Projectpage />
          </div>
          <div className="pcb-page">
            <ContactPage />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
