import './index.css'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Experience from './components/Experience.jsx'
import Certifications from './components/Certifications.jsx'
import Education from './components/Education.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'

function App() {
  return (
    <div>
      <Nav />

      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Education />
      </main>

      <Footer />

      <ChatWidget />
    </div>
  )
}

export default App
