import { useRef } from 'react'
import { Stack, } from 'react-bootstrap'
import Navigationbar from './components/Navbar'
import Home from './Pages/Home'
import Projectpage from './Pages/Projects'
import ContactPage from './Pages/Contact'

function App() {
  const homeRef = useRef<HTMLDivElement>(null!)
  const projectsRef = useRef<HTMLDivElement>(null!)
  const contactRef = useRef<HTMLDivElement>(null!)  
  return (
    <Stack>
      <Navigationbar 
        onHome={() => homeRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onProjects={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onContact={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      <Home innerRef={homeRef} />
      <div style={{paddingBottom:"10rem"}}/>
      <Projectpage innerRef={projectsRef} />
      <ContactPage innerRef={contactRef} />
      {/* <About innerRef={aboutRef} />
      <Projects innerRef={projectsRef} />
      <Contact innerRef={contactRef} /> */}
    </Stack>
  )
}

export default App
