const groups = [
  {title:'CI/CD & Version Control', items:['Git','GitHub','GitHub Actions','Jenkins (basics)']},
  {title:'Cloud Platforms', items:['AWS (EC2, S3, Amplify)','IBM Cloud (Watsonx, Toolchain, Continuous Delivery)']},
  {title:'Containerization', items:['Docker','basic Kubernetes concepts']},
  {title:'Scripting & OS', items:['Linux (Ubuntu)','Bash','Python (automation, Pandas, Matplotlib)']},
  {title:'Databases', items:['SQL','PostgreSQL','Redis (conceptual)']},
  {title:'Frontend', items:['HTML5','CSS3','JavaScript','React.js (learning)','Angular (basics)']}
]

export default function Skills() {
  return (
    <section id="skills" className="section">
      <h2>Skills</h2>
      <div className="cards" style={{ marginTop: 24 }}>
        {groups.map((g) => (
          <div className="card reveal-item" key={g.title}>
            <h3>{g.title}</h3>
            <ul>
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
