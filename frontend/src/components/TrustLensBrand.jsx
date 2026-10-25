import '../styles/TrustLensBrand.css'

function TrustLensBrand() {
  return (
    <span className="dashboard-brand-content">
      <span className="dashboard-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9l-5 8.5M9.5 9l5 8.5M6 12h12" />
        </svg>
      </span>
      <span>Trust<span className="dashboard-accent">Lens</span></span>
    </span>
  )
}

export default TrustLensBrand
