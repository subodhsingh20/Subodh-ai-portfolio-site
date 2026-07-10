const projects = [
  {
    id: 1,
    title: 'Farmer-to-Customer Marketplace (FarmDirect)',
    desc: 'Dockerised Node.js/Express backend, RESTful APIs backed by IBM Cloudant, CI/CD via AWS Amplify + Render, OpenStreetMap geolocation, Stripe test-mode payments.',
    tech: 'Node.js, Express, Docker, AWS Amplify, IBM Cloudant, OpenStreetMap',
    link: 'https://main.d2rlq4a76ba9ai.amplifyapp.com/'
  },
  {
    id: 2,
    title: 'AI Portfolio Assistant (RAG Chatbot)',
    desc: 'Built a retrieval-augmented AI chatbot embedded directly into this portfolio, letting visitors ask questions about my skills, projects, and experience and get grounded, real-time answers.',
    tech: 'React, Node.js/Express, Groq (Llama 3.3 70B), Local embeddings (MiniLM), In-memory vector search'
  },
  {
    id: 3,
    title: 'NLP AI Chatbot',
    desc: 'Built during the CodTech internship as a Python-based chatbot covering natural language understanding and response generation.',
    tech: 'Python, NLP'
  },
  {
    id: 4,
    title: 'Weather API Dashboard',
    desc: 'Live dashboard with automated data collection and visualization using Python, REST APIs, Pandas, and Matplotlib.',
    tech: 'Python, REST APIs, Pandas, Matplotlib'
  },
  {
    id: 5,
    title: 'PDF Report Generator',
    desc: 'Automated reporting workflow built for the CodTech internship with Python-based data collection and report generation.',
    tech: 'Python'
  }
]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <h2>Projects</h2>
      <div className="cards" style={{ marginTop: 24 }}>
        {projects.map((p) => (
          <article className="card reveal-item" key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="tags">
              {p.tech.split(',').map((tech) => (
                <span className="tag" key={tech.trim()}>{tech.trim()}</span>
              ))}
            </div>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="small"
                style={{ marginTop: 18, display: 'inline-block' }}
              >
                Live demo
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
