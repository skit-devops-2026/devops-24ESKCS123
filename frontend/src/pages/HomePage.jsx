import { useEffect, useState } from 'react'
import TrustLensBrand from '../components/TrustLensBrand.jsx'
import '../styles/HomePage.css'

const steps = [
  ['Inspect the listing', 'We analyze the job description, recruiter email, language patterns, and payment instructions for suspicious signals.'],
  ['Score risk factors', 'The platform ranks urgent language, unrealistic salary claims, fake branding, and unusual payment requests.'],
  ['Get a verdict', 'You receive a clear risk assessment with red flags summarized so you can avoid scams before applying.'],
]

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visibleSections, setVisibleSections] = useState({})

  useEffect(() => {
    const sections = document.querySelectorAll('.home-reveal')
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((current) => ({ ...current, [entry.target.id]: true }))
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-container home-nav-inner">
          <a href="/" className="home-brand"><TrustLensBrand /></a>
          <div className="home-nav-links">
            <a href="#about-section">How It Works</a>
            <a href="#services-section">Scam Stats</a>
            <a href="#contact-section">About</a>
          </div>
          <button className="home-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">☰</button>
          <div className="home-actions">
            <a href="/signup" className="home-outline-link">Sign Up</a>
            <a href="/detector" className="home-primary-link">Scan Job Offer</a>
          </div>
        </div>
        {menuOpen && (
          <div className="home-mobile-menu">
            <a href="#about-section" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#services-section" onClick={() => setMenuOpen(false)}>Scam Stats</a>
            <a href="#contact-section" onClick={() => setMenuOpen(false)}>About</a>
          </div>
        )}
      </nav>

      <main>
        <section className="home-hero" id="hero-section">
          <div className="home-hero-glow" />
          <div className="home-container home-hero-grid">
            <div className="home-hero-copy">
              <div className="home-eyebrow"><span className="home-pulse" />AI-POWERED FRAUD INVESTIGATION</div>
              <h1>Inspect the <span>Unseen Scams</span> in Job Offers.</h1>
              <p>Fake recruiters steal millions from eager job seekers every year. TrustLens exposes hidden red flags, wire-transfer traps, and malicious recruitment listings before you hit apply.</p>
              <div className="home-hero-actions">
                <a href="/detector" className="home-primary-link">Analyze a Listing <span>→</span></a>
                <a href="/signup" className="home-outline-link">Create Account</a>
              </div>
            </div>
            <div className="home-preview-card">
              <div className="preview-top"><span>TrustLens analysis</span><b>HIGH RISK: 89%</b></div>
              <div className="preview-code">
                <p>// Sample Suspicious Recruitment Email</p>
                <p><strong>From:</strong> hr-recruiter@telegram-jobs-now.com</p>
                <p><strong>Subject:</strong> URGENT: Remote Data Entry Role ($65/hr)</p>
                <div className="preview-message">“Congratulations! You are selected without an interview. Please purchase your home-office equipment via wire transfer...”<div className="preview-tags"><span>🚩 Wire Transfer Request</span><span>🚩 No Interview Required</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <div className="home-container home-sections">
          <section id="about-section" className={`home-panel home-reveal ${visibleSections['about-section'] ? 'is-visible' : ''}`}>
            <SectionHeading eyebrow="How TrustLens Works" title="A smarter way to expose suspicious recruitment" />
            <div className="home-step-grid">
              {steps.map(([title, text], index) => <article className="home-step" key={title}><div className="home-step-icon">{index + 1}</div><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </section>

          <section id="services-section" className={`home-panel home-reveal ${visibleSections['services-section'] ? 'is-visible' : ''}`}>
            <div className="home-stats-layout">
              <div><SectionHeading eyebrow="Scam Stats" title="Fraud isn’t rare. It’s growing faster than most people notice." /><div className="home-stat-grid">{[['87%', 'job scams use urgency'], ['1.2M', 'reported scam offers'], ['64%', 'ask for personal data'], ['3x', 'faster spread online']].map(([value, text]) => <div className="home-stat" key={value}><b>{value}</b><span>{text}</span></div>)}</div></div>
              <div className="home-stat-callout"><b>Stay one step ahead.</b><p>Check suspicious offers before sharing your details or paying a fee.</p><a href="/detector">Try the detector →</a></div>
            </div>
          </section>

          <section id="contact-section" className={`home-panel home-contact home-reveal ${visibleSections['contact-section'] ? 'is-visible' : ''}`}>
            <div><SectionHeading eyebrow="About TrustLens" title="Protect your next career move." /><p>TrustLens gives job seekers a practical first line of defense against recruitment scams.</p></div>
            <a href="/signup" className="home-primary-link">Create your account</a>
          </section>
        </div>
      </main>
      <footer className="home-footer">© TrustLens Scam Detector.</footer>
    </div>
  )
}

function SectionHeading({ eyebrow, title }) {
  return <div className="home-section-heading"><p>{eyebrow}</p><h2>{title}</h2></div>
}

export default HomePage
