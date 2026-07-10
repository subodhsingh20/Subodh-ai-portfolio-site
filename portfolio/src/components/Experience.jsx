const experiences = [
  {title:'Python Developer Intern — CodTech IT Solutions Pvt. Ltd.', period:'June 10 - July 25, 2025', details:'Built and deployed three end-to-end Python applications (Weather API Dashboard, PDF Report Generator, NLP AI Chatbot), covering full SDLC. Automated data workflows using Python, REST APIs, Pandas/Matplotlib.'},
  {title:'Community Outreach Volunteer — Ahmedabad Book Club', period:'2024', details:'4-member team delivering sessions across Ahmedabad schools.'}
]

export default function Experience() {
  return (
    <section id="experience" className="section">
      <h2>Experience</h2>
      <div style={{ marginTop: 24 }}>
        {experiences.map((e, idx) => (
          <div key={idx} className="card reveal-item" style={{ marginBottom: 20 }}>
            <h3>{e.title}</h3>
            <div className="small">{e.period}</div>
            <p style={{ marginTop: 12 }}>{e.details}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
