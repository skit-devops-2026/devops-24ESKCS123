import '../styles/AuthLayout.css'

function AuthLayout({ actionLabel, actionHref, children }) {
  return (
    <div className="signup-page">
      <nav className="signup-nav">
        <div className="signup-container signup-nav-inner">
          <a href="pages/indexDesign.html" className="brand-link">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9l-5 8.5M9.5 9l5 8.5M6 12h12" />
              </svg>
            </span>
            <span>Trust<span className="accent-text">Lens</span></span>
          </a>

          <div className="signup-nav-links">
            <a href="pages/indexDesign.html#about-section">How It Works</a>
            <a href="pages/indexDesign.html#services-section">Scam Stats</a>
            <a href="pages/indexDesign.html#contact-section">About</a>
          </div>

          <div className="signup-nav-actions">
            <a href={actionHref} className="home-link">{actionLabel}</a>
            <a href="pages/detector.html" className="primary-link">Scan Job Offer</a>
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
