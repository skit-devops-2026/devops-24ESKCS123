import { useEffect, useState } from 'react'
import TrustLensBrand from '../components/TrustLensBrand.jsx'
import { getScan, updateScan } from '../api/scans.js'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/ScanDetailPage.css'

const toneFor = (riskLevel) => riskLevel === 'High risk' ? 'red' : riskLevel === 'Medium risk' ? 'amber' : 'emerald'

function ScanDetailPage({ scanId }) {
  const { token, logout } = useAuth()
  const [scan, setScan] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getScan(token, scanId)
      .then((response) => { if (active) setScan(response.scan) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [scanId, token])

  const togglePin = async () => {
    try {
      const response = await updateScan(token, scan._id, { pinned: !scan.pinned })
      setScan(response.scan)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.replace('/')
  }

  return (
    <div className="scan-detail-page">
      <nav className="scan-detail-nav">
        <div className="scan-detail-container scan-detail-nav-inner">
          <a href="/" className="scan-detail-brand"><TrustLensBrand /></a>
          <div className="scan-detail-actions">
            <a href="/dashboard">Dashboard</a>
            <a href="/detector">New scan</a>
            <button type="button" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </nav>
      <main className="scan-detail-container scan-detail-main">
        <a href="/dashboard" className="scan-detail-back">← Back to dashboard</a>
        {isLoading && <p className="scan-detail-muted">Loading report…</p>}
        {error && <div className="scan-detail-error" role="alert">{error}</div>}
        {scan && (
          <>
            <header className="scan-detail-heading">
              <div><p>Saved report</p><h1>{scan.title}</h1><time dateTime={scan.createdAt}>{new Date(scan.createdAt).toLocaleString()}</time></div>
              <div className={`scan-detail-score ${toneFor(scan.riskLevel)}`}><strong>{scan.score}%</strong><span>{scan.riskLevel}</span></div>
            </header>
            <section className="scan-detail-grid">
              <article className="scan-detail-panel">
                <p className="scan-detail-label">Verdict</p>
                <p className="scan-detail-summary">{scan.summary}</p>
                <div className="scan-detail-controls"><button type="button" onClick={togglePin}>{scan.pinned ? 'Unpin report' : 'Pin report'}</button><a href="/detector">Run another scan</a></div>
              </article>
              <article className="scan-detail-panel">
                <DetailList title="Detected flags" items={scan.flags.length ? scan.flags : ['No obvious scam markers found.']} />
                <DetailList title="Recommended next steps" items={scan.recommendations} />
              </article>
              <article className="scan-detail-panel scan-detail-input">
                <p className="scan-detail-label">Original submitted text</p>
                <pre>{scan.inputText}</pre>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function DetailList({ title, items }) {
  return <div className="scan-detail-list"><p className="scan-detail-label">{title}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
}

export default ScanDetailPage
