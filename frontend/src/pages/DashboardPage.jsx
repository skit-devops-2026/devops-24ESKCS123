import { useEffect, useMemo, useState } from 'react'
import TrustLensBrand from '../components/TrustLensBrand.jsx'
import { deleteScan, getScans, updateScan } from '../api/scans.js'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/DashboardPage.css'

const riskTone = {
  'High risk': 'red',
  'Medium risk': 'amber',
  'Low risk': 'emerald',
  'No input': 'neutral',
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function DashboardPage() {
  const { user, token, logout } = useAuth()
  const [scans, setScans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let active = true

    async function loadScans() {
      try {
        const response = await getScans(token)
        if (active) setScans(response.scans)
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadScans()
    return () => { active = false }
  }, [token])

  const stats = useMemo(() => ({
    total: scans.length,
    highRisk: scans.filter((scan) => scan.riskLevel === 'High risk').length,
    needsReview: scans.filter((scan) => scan.riskLevel === 'Medium risk' || scan.riskLevel === 'High risk').length,
    pinned: scans.filter((scan) => scan.pinned).length,
  }), [scans])

  const pinnedScans = scans.filter((scan) => scan.pinned)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const filteredScans = scans
    .filter((scan) => riskFilter === 'all' || scan.riskLevel === riskFilter)
    .filter((scan) => `${scan.title} ${scan.summary} ${scan.inputText}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'newest' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt))
  const recentScans = filteredScans.slice(0, 8)

  const handleLogout = () => {
    logout()
    window.location.replace('/')
  }

  const handleTogglePin = async (scan) => {
    setActionError('')
    try {
      const response = await updateScan(token, scan._id, { pinned: !scan.pinned })
      setScans((current) => current.map((item) => item._id === response.scan._id ? response.scan : item))
    } catch (requestError) {
      setActionError(requestError.message)
    }
  }

  const handleRename = async (scan) => {
    const title = window.prompt('Give this scan a title:', scan.title)
    if (title === null || title.trim() === '' || title.trim() === scan.title) return

    setActionError('')
    try {
      const response = await updateScan(token, scan._id, { title: title.trim() })
      setScans((current) => current.map((item) => item._id === response.scan._id ? response.scan : item))
    } catch (requestError) {
      setActionError(requestError.message)
    }
  }

  const handleDelete = async (scan) => {
    if (!window.confirm(`Delete "${scan.title}"? This cannot be undone.`)) return

    setActionError('')
    try {
      await deleteScan(token, scan._id)
      setScans((current) => current.filter((item) => item._id !== scan._id))
    } catch (requestError) {
      setActionError(requestError.message)
    }
  }

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="dashboard-container dashboard-nav-inner">
          <a href="/" className="dashboard-brand"><TrustLensBrand /></a>
          <div className="dashboard-nav-actions">
            <span className="dashboard-user">{user?.fullName}</span>
            <a href="/detector" className="dashboard-nav-link">New scan</a>
            <a href="/settings" className="dashboard-nav-link">Settings</a>
            <button type="button" className="dashboard-nav-link dashboard-logout" onClick={handleLogout}>Log out</button>
            <a href="/" className="dashboard-home-link">Home</a>
          </div>
          <div className="dashboard-filters">
            <input aria-label="Search scans" placeholder="Search reports…" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select aria-label="Filter by risk" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}><option value="all">All risk levels</option><option>High risk</option><option>Medium risk</option><option>Low risk</option></select>
            <select aria-label="Sort scans" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select>
          </div>
        </div>
      </nav>

      <main className="dashboard-container dashboard-main">
        <section className="dashboard-heading">
          <div>
            <p className="dashboard-eyebrow">Dashboard</p>
            <h1>{user ? `${user.fullName}'s reports at a glance` : 'Your reports at a glance'}</h1>
            <p className="dashboard-subtitle">Review your saved recruitment checks and keep suspicious offers close.</p>
          </div>
          <span className="signed-in-badge">Signed in area</span>
        </section>

        {error && (
          <div className="dashboard-alert" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}
        {actionError && <div className="dashboard-alert" role="alert">{actionError}</div>}

        <section className="summary-grid dashboard-summary" aria-label="Scan summary">
          <SummaryItem value={isLoading ? '—' : stats.total} label="reports saved" tone="sky" />
          <SummaryItem value={isLoading ? '—' : stats.highRisk} label="high-risk reports" tone="red" />
          <SummaryItem value={isLoading ? '—' : stats.needsReview} label="need review" tone="amber" />
          <SummaryItem value={isLoading ? '—' : stats.pinned} label="pinned reports" tone="fuchsia" />
        </section>

        <section className="dashboard-panel dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-panel-label">Recent scans</p>
              <h2>Latest checks</h2>
            </div>
            <a href="/detector" className="dashboard-section-action">Analyze another offer →</a>
          </div>
          {isLoading ? <LoadingState /> : recentScans.length === 0 ? <EmptyState /> : (
            <div className="scan-list">
              {recentScans.map((scan) => (
                <ScanRow key={scan._id} scan={scan} onTogglePin={handleTogglePin} onRename={handleRename} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-panel-label">Pinned reports</p>
              <h2>Keep an eye on these</h2>
            </div>
          </div>
          {isLoading ? <LoadingState /> : pinnedScans.length === 0 ? (
            <p className="dashboard-muted">Pin a scan from your recent checks to find it here.</p>
          ) : (
            <div className="pinned-grid">
              {pinnedScans.map((scan) => <PinnedCard key={scan._id} scan={scan} onTogglePin={handleTogglePin} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function ScanRow({ scan, onTogglePin, onRename, onDelete }) {
  const tone = riskTone[scan.riskLevel] || 'neutral'
  return (
    <article className="scan-row">
      <div className={`scan-score ${tone}`}><strong>{scan.score}%</strong><span>{scan.riskLevel}</span></div>
      <div className="scan-row-content">
        <h3><a href={`/scans/${scan._id}`}>{scan.title}</a></h3>
        <p>{scan.summary}</p>
        <time dateTime={scan.createdAt}>{formatDate(scan.createdAt)}</time>
      </div>
      <div className="scan-row-actions">
        <button type="button" onClick={() => onTogglePin(scan)}>{scan.pinned ? 'Unpin' : 'Pin'}</button>
        <button type="button" onClick={() => onRename(scan)}>Rename</button>
        <button type="button" className="danger-action" onClick={() => onDelete(scan)}>Delete</button>
      </div>
    </article>
  )
}

function PinnedCard({ scan, onTogglePin }) {
  const tone = riskTone[scan.riskLevel] || 'neutral'
  return (
    <article className={`pinned-card ${tone}`}>
      <div className="pinned-card-top"><span>{scan.riskLevel}</span><strong>{scan.score}%</strong></div>
      <h3>{scan.title}</h3>
      <p>{scan.summary}</p>
      <button type="button" onClick={() => onTogglePin(scan)}>Unpin report</button>
    </article>
  )
}

function SummaryItem({ value, label, tone }) {
  return <div className={`summary-item ${tone}`}><p>{value}</p><span>{label}</span></div>
}

function LoadingState() {
  return <p className="dashboard-muted">Loading your scan history…</p>
}

function EmptyState() {
  return (
    <div className="dashboard-empty">
      <h3>Your scan history is empty</h3>
      <p>Analyze a job offer to get your first risk report and see it here.</p>
      <a href="/detector" className="dashboard-section-action">Start your first scan →</a>
    </div>
  )
}

export default DashboardPage
