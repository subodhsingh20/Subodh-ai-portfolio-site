const certifications = [
  {
    title: 'Introduction to Cloud (CC0101EN)',
    issuer: 'IBM',
    date: '9 April 2026'
  },
  {
    title: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'Cisco Networking Academy',
    date: '6 Oct 2025'
  },
  {
    title: 'Python 101 for Data Science (PY0101EN)',
    issuer: 'IBM',
    date: '9 April 2025'
  },
  {
    title: 'Linux Basics Course & Labs',
    issuer: 'KodeKloud',
    date: 'Feb 2025'
  },
  {
    title: 'Docker Essentials: A Developer Introduction (CO0101EN)',
    issuer: 'IBM',
    date: 'Oct 2024'
  },
  {
    title: 'Red Hat System Administration I (RH124)',
    issuer: 'Red Hat Academy',
    date: '8 June 2024',
    badge: 'Attended'
  },
  {
    title: 'CCNAv7: Introduction to Networks',
    issuer: 'Cisco Networking Academy',
    date: '17 May 2024'
  },
  {
    title: 'Introduction to SQL',
    issuer: 'DataCamp',
    date: 'Aug 2023'
  }
]

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <h2>Certifications</h2>
      <div className="cards" style={{ marginTop: 24 }}>
        {certifications.map((cert) => (
          <div className="card reveal-item" key={cert.title}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{cert.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{cert.issuer}</div>
              </div>
              {cert.badge ? (
                <span style={{ fontSize: 11, color: '#1e40af', background: '#dbeafe', borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                  {cert.badge}
                </span>
              ) : null}
            </div>
            <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)' }}>{cert.date}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
