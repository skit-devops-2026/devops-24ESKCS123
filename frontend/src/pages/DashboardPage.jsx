import TrustLensBrand from '../components/TrustLensBrand.jsx'
import '../styles/DashboardPage.css'

const reportCards = [
  {
    label: 'High risk',
    title: 'Urgent warehouse role',
    detail: '87% • Today • Wire transfer request',
    tone: 'red',
  },
  {
    label: 'Medium risk',
    title: 'Remote support listing',
    detail: '54% • Yesterday • Unclear recruiter info',
    tone: 'amber',
  },
  {
    label: 'Low risk',
    title: 'Campus hiring post',
    detail: '18% • 2 days ago • Normal interview flow',
    tone: 'emerald',
  },
  {
    label: 'Saved note',
    title: 'Interview follow-up',
    detail: 'Draft • Company website checked',
    tone: 'sky',
  },
  {
    label: 'Pinned report',
    title: 'Fake recruiter from messaging app',
    detail: '92% • Pinned for review • Missing company domain',
    tone: 'fuchsia',
    wide: true,
  },
  {
    label: 'Placeholder',
    title: 'Space for filters, search, charts, or tags',
    detail: 'This tile is just a rough layout marker so we can see the dashboard structure before building the actual interactions.',
    tone: 'neutral',
    wide: true,
  },
]

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="dashboard-container dashboard-nav-inner">
          <a href="/" className="dashboard-brand">
            <TrustLensBrand />
          </a>
          <div className="dashboard-nav-actions">
            <a href="/login" className="dashboard-nav-link">Login</a>
            <a href="/detector" className="dashboard-nav-link">Detector</a>
            <a href="/" className="dashboard-home-link">Home</a>
          </div>
        </div>
      </nav>

      <main className="dashboard-container dashboard-main">
        <section className="dashboard-heading">
          <div>
            <p className="dashboard-eyebrow">Dashboard</p>
            <h1>Your previous reports at a glance</h1>
          </div>
          <span className="signed-in-badge">Signed in area</span>
        </section>

        <section className="report-grid">
          {reportCards.map((card) => (
            <article className={`report-card ${card.tone}${card.wide ? ' report-card-wide' : ''}`} key={card.title}>
              <p>{card.label}</p>
              <h2>{card.title}</h2>
              <span>{card.detail}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-lower-grid">
          <article className="dashboard-panel">
            <p className="dashboard-panel-label">Quick summary</p>
            <div className="summary-grid">
              <SummaryItem value="12" label="reports saved" tone="red" />
              <SummaryItem value="4" label="needs review" tone="amber" />
              <SummaryItem value="8" label="cleared entries" tone="emerald" />
            </div>
          </article>

          <article className="dashboard-panel">
            <p className="dashboard-panel-label">Access area</p>
            <div className="access-list">
              <div className="access-item sky">Saved scans panel</div>
              <div className="access-item fuchsia">Pinned reports panel</div>
              <div className="access-item neutral">Account activity panel</div>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

function SummaryItem({ value, label, tone }) {
  return (
    <div className={`summary-item ${tone}`}>
      <p>{value}</p>
      <span>{label}</span>
    </div>
  )
}

export default DashboardPage
