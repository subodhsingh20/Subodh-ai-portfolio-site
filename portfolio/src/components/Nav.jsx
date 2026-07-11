import { useEffect, useState } from 'react'

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#education', label: 'Education' }
]

export default function Nav() {
  const [active, setActive] = useState('about')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = navItems.map((item) => document.querySelector(item.href)).filter(Boolean)
      const offset = window.innerHeight * 0.25
      const current = sections
        .filter((section) => section.getBoundingClientRect().top - offset <= 0)
        .pop()
      if (current) {
        setActive(current.id)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`top-nav ${scrolled ? 'top-nav--scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-brand">
          <strong>Subodh Singh</strong>
          <span className="nav-tag">Software Engineer — Cloud, DevOps & Automation</span>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="site-navigation"
          className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={active === item.href.slice(1) ? 'active' : ''}
              onClick={() => {
                setActive(item.href.slice(1))
                setMenuOpen(false)
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
