import '../styles/AuthLayout.css'
import TrustLensBrand from './TrustLensBrand.jsx'

function AuthLayout({ actionLabel, actionHref, children }) {
  return (
    <div className="signup-page">
      <nav className="signup-nav">
        <div className="signup-container signup-nav-inner">
          <a href="/" className="brand-link">
            <TrustLensBrand />
          </a>

          <div className="signup-nav-links">
            <a href="/#about-section">How It Works</a>
            <a href="/#services-section">Scam Stats</a>
            <a href="/#contact-section">About</a>
          </div>

          <div className="signup-nav-actions">
            <a href={actionHref} className="home-link">{actionLabel}</a>
            <a href="/detector" className="primary-link">Scan Job Offer</a>
          </div>
        </div>
      </nav>

      <main className="signup-main">
        <div className="signup-glow signup-glow-left" />
        <div className="signup-glow signup-glow-center" />
        <section className="signup-container signup-content">{children}</section>
      </main>

      <footer className="signup-footer">© TrustLens Scam Detector.</footer>
    </div>
  )
}

export default AuthLayout
