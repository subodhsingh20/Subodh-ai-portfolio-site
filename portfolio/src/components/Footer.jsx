export default function Footer(){
  return (
    <footer id="contact" className="section contact-section" style={{padding:'64px 20px 40px', textAlign:'center'}}>
      <div className="card" style={{maxWidth:720, margin:'0 auto', textAlign:'left', padding:'24px'}}>
        <h2>Contact</h2>
        <p className="small" style={{margin:'12px 0 0'}}>
          Reach out for internships, collaborations, or project discussions.
        </p>
        <div style={{marginTop:16}} className="contact-buttons">
          <a className="btn" href="mailto:subodhsingh6536@gmail.com" aria-label="Email Subodh">Email</a>
          <a className="btn" href="tel:+919054608554" aria-label="Call Subodh">Call</a>
          <a className="btn" href="https://github.com/subodhsingh20" target="_blank" rel="noreferrer" aria-label="GitHub Profile">GitHub</a>
          <a className="btn" href="https://www.linkedin.com/in/subodh-singh-717828280/" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile">LinkedIn</a>
        </div>
        <div style={{marginTop:16}} className="small">
          Email: subodhsingh6536@gmail.com • Phone: +91 9054608554
        </div>
        <div style={{marginTop:8}} className="small">© Subodh Singh</div>
      </div>
    </footer>
  )
}
