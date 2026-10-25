import { useState } from 'react'
import TrustLensBrand from '../components/TrustLensBrand.jsx'
import { analyzeJobText } from '../../js/detectorLogic.js'
import '../styles/DetectorPage.css'

const sample = 'URGENT HIRING! We need someone immediately. No interview required. Please pay for equipment using a wire transfer and send your details via WhatsApp.'

function DetectorPage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const analyze = () => setResult(analyzeJobText(text))

  return (
    <div className="detector-page">
      <nav className="detector-nav"><div className="detector-container detector-nav-inner"><a href="/" className="detector-brand"><TrustLensBrand /></a><div className="detector-actions"><a href="/login">Login</a><a href="/dashboard">Dashboard</a><a href="/">Home</a></div></div></nav>
      <main className="detector-container detector-main">
        <section className="detector-heading"><div><p>Scam Detector</p><h1>Check a job offer before you apply</h1></div><span className={`detector-status ${result ? result.riskLevel.toLowerCase().replace(' ', '-') : ''}`}>{result?.riskLevel || 'Ready'}</span></section>
        <div className="detector-grid">
          <section className="detector-card"><form onSubmit={(event) => { event.preventDefault(); analyze() }}><label htmlFor="job-input">Paste the listing, recruiter email, or message</label><textarea id="job-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Example: We are hiring immediately and need you to pay for your equipment via wire transfer before your first interview..." /><div className="detector-buttons"><button type="submit">Analyze listing</button><button type="button" onClick={() => { setText(sample); setResult(analyzeJobText(sample)) }}>Load sample</button><button type="button" onClick={() => { setText(''); setResult(null) }}>Clear</button></div></form></section>
          <ResultPanel result={result} />
        </div>
        <section className="detector-info-grid">{[['Red flags', 'Urgent hiring, unofficial contact channels, advance fee requests, and vague interview steps.'], ['Signals', 'Poor grammar, unrealistic salaries, blurry company identities, and suspicious payment demands.'], ['Verdict', 'TrustLens gives a practical risk snapshot before you send your details or pay any fees.']].map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</section>
      </main>
    </div>
  )
}

function ResultPanel({ result }) {
  if (!result) return <aside className="detector-result"><p>Result</p><b>0%</b><strong>No analysis yet</strong><span>Paste a job offer to see risk signals, red flags, and a quick verdict.</span></aside>
  return <aside className={`detector-result result-${result.riskLevel.toLowerCase().replace(' ', '-')}`}><p>Result</p><div className="result-score"><b>{result.score}%</b><strong>{result.riskLevel}</strong></div><span>{result.summary}</span><ResultList title="Detected flags" items={result.flags.length ? result.flags : ['No obvious scam markers found.']} /><ResultList title="Recommended next steps" items={result.recommendations} /></aside>
}

function ResultList({ title, items }) {
  return <div className="result-list"><p>{title}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
}

export default DetectorPage
