export function observeSections(callback) {
  if (typeof window === 'undefined' || !window.IntersectionObserver) return () => {}

  const sections = Array.from(document.querySelectorAll('section[id]'))
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target.id)
        }
      })
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0.1
    }
  )

  sections.forEach((section) => observer.observe(section))

  return () => observer.disconnect()
}
