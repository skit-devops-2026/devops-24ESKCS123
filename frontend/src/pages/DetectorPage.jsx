import { useState } from 'react'
import TrustLensBrand from '../components/TrustLensBrand.jsx'
import { createScan } from '../api/scans.js'
import { useAuth } from '../context/AuthContext.jsx'
import { analyzeJobText } from '../../js/detectorLogic.js'
import '../styles/DetectorPage.css'

const sample = 'URGENT HIRING! We need someone immediately. No interview required. Please pay for equipment using a wire transfer and send your details via WhatsApp.'

function DetectorPage() {
  const { isAuthenticated, token } = useAuth()
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  const analyze = (value = text) => {
    setResult(analyzeJobText(value))
    setSaveMessage(null)
  }

  const handleInputChange = (event) => {
    setText(event.target.value)
    if (saveMessage) setSaveMessage(null)
  }

  const handleSave = async () => {
    if (!result || result.riskLevel === 'No input' || !isAuthenticated) return

    setIsSaving(true)
    setSaveMessage(null)
    try {
      await createScan(token, {
        inputText: text.trim(),
        title: title.trim() || `Scan ${new Date().toISOString().slice(0, 10)}`,
        score: result.score,
        riskLevel: result.riskLevel,
        summary: result.summary,
        flags: result.flags,
        recommendations: result.recommendations,
      })
      setSaveMessage({ type: 'success', text: 'Scan saved to your dashboard.' })
    } catch (error) {
      setSaveMessage({ type: 'error', text: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const loadSample = () => {
    setText(sample)
    analyze(sample)
  }

  const clear = () => {
    setText('')
    setResult(null)
    setTitle('')
    setSaveMessage(null)
  }

  return (
    <div className="detector-page">
      <nav className="detector-nav">
        <div className="detector-container detector-nav-inner">
          <a href="/" className="detector-brand"><TrustLensBrand /></a>
          <div className="detector-actions">
            {isAuthenticated ? <a href="/dashboard">Dashboard</a> : <a href="/login">Login</a>}
            <a href="/">Home</a>
          </div>
        </div>
      </nav>
      <main className="detector-container detector-main">
        <section className="detector-heading">
          <div><p>Scam Detector</p><h1>Check a job offer before you apply</h1></div>
          <span className={`detector-status ${result ? result.riskLevel.toLowerCase().replace(' ', '-') : ''}`}>{result?.riskLevel || 'Ready'}</span>
        </section>
        <div className="detector-grid">
          <section className="detector-card">
            <form onSubmit={(event) => { event.preventDefault(); analyze() }}>
              <label htmlFor="job-input">Paste the listing, recruiter email, or message</label>
              <textarea id="job-input" value={text} onChange={handleInputChange} maxLength="50000" placeholder="Example: We are hiring immediately and need you to pay for your equipment via wire transfer before your first interview..." />
              <div className="detector-input-meta"><span>{text.length.toLocaleString()} / 50,000 characters</span></div>
              <div className="detector-buttons">
                <button type="submit">Analyze listing</button>
                <button type="button" onClick={loadSample}>Load sample</button>
                <button type="button" onClick={clear}>Clear</button>
              </div>
            </form>
          </section>
          <ResultPanel
            result={result}
            title={title}
            onTitleChange={setTitle}
            isAuthenticated={isAuthenticated}
            isSaving={isSaving}
            saveMessage={saveMessage}
            onSave={handleSave}
          />
        </div>
        <section className="detector-info-grid">{[['Red flags', 'Urgent hiring, unofficial contact channels, advance fee requests, and vague interview steps.'], ['Signals', 'Poor grammar, unrealistic salaries, blurry company identities, and suspicious payment demands.'], ['Verdict', 'TrustLens gives a practical risk snapshot before you send your details or pay any fees.']].map(([heading, description]) => <article key={heading}><h3>{heading}</h3><p>{description}</p></article>)}</section>
      </main>
    </div>
  )
}

function ResultPanel({ result, title, onTitleChange, isAuthenticated, isSaving, saveMessage, onSave }) {
  if (!result) return <aside className="detector-result"><p>Result</p><b>0%</b><strong>No analysis yet</strong><span>Paste a job offer to see risk signals, red flags, and a quick verdict.</span></aside>

  return (
    <aside className={`detector-result result-${result.riskLevel.toLowerCase().replace(' ', '-')}`}>
      <p>Result</p>
      <div className="result-score"><b>{result.score}%</b><strong>{result.riskLevel}</strong></div>
      <span>{result.summary}</span>
      <ResultList title="Detected flags" items={result.flags.length ? result.flags : ['No obvious scam markers found.']} />
      <ResultList title="Recommended next steps" items={result.recommendations} />
      {result.riskLevel !== 'No input' && (
        <SavePanel
          title={title}
          onTitleChange={onTitleChange}
          isAuthenticated={isAuthenticated}
          isSaving={isSaving}
          saveMessage={saveMessage}
          onSave={onSave}
        />
      )}
    </aside>
  )
}

function SavePanel({ title, onTitleChange, isAuthenticated, isSaving, saveMessage, onSave }) {
  if (!isAuthenticated) {
    return (
      <div className="detector-save-panel detector-login-prompt">
        <strong>Want to keep this result?</strong>
        <span>Sign in to save this scan to your personal dashboard.</span>
        <a href="/login">Sign in to save →</a>
      </div>
    )
  }

  return (
    <div className="detector-save-panel">
      <label htmlFor="scan-title">Save this report</label>
      <input id="scan-title" value={title} onChange={(event) => onTitleChange(event.target.value)} maxLength="150" placeholder="Optional report title" />
      <button type="button" onClick={onSave} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save to dashboard'}</button>
      {saveMessage && <span className={`save-message ${saveMessage.type}`} role={saveMessage.type === 'error' ? 'alert' : 'status'}>{saveMessage.text}</span>}
    </div>
  )
}

function ResultList({ title, items }) {
  return <div className="result-list"><p>{title}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
}

export default DetectorPage
