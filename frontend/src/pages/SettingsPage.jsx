import { useState } from 'react'
import TrustLensBrand from '../components/TrustLensBrand.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/SettingsPage.css'

function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const [form, setForm] = useState({ fullName: user.fullName, goal: user.goal, updates: user.updates })
  const [status, setStatus] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setStatus(null)
    try {
      await updateUser(form)
      setStatus({ type: 'success', text: 'Account preferences updated.' })
    } catch (error) {
      setStatus({ type: 'error', text: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.replace('/')
  }

  return (
    <div className="settings-page">
      <nav className="settings-nav"><div className="settings-container settings-nav-inner"><a href="/" className="settings-brand"><TrustLensBrand /></a><div className="settings-actions"><a href="/dashboard">Dashboard</a><a href="/detector">New scan</a><button type="button" onClick={handleLogout}>Log out</button></div></div></nav>
      <main className="settings-container settings-main">
        <div className="settings-heading"><p>Account</p><h1>Settings and preferences</h1><span>Control how TrustLens personalizes your job-safety workflow.</span></div>
        <form className="settings-card" onSubmit={handleSubmit}>
          <div className="settings-field"><label htmlFor="settings-name">Full name</label><input id="settings-name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></div>
          <div className="settings-field"><label htmlFor="settings-email">Email address</label><input id="settings-email" value={user.email} disabled /><small>Email changes are not available yet.</small></div>
          <div className="settings-field"><label htmlFor="settings-goal">Primary goal</label><select id="settings-goal" value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })}><option value="check_job_offers">Check if a job offer is legitimate</option><option value="get_scam_alerts">Get scam alerts and updates</option><option value="career_support">Track career opportunities safely</option><option value="other">Other</option></select></div>
          <label className="settings-checkbox"><input type="checkbox" checked={form.updates} onChange={(event) => setForm({ ...form, updates: event.target.checked })} /><span>Receive scam alerts and platform updates relevant to my job search.</span></label>
          {status && <p className={`settings-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
          <button type="submit" className="settings-submit" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save preferences'}</button>
        </form>
        <section className="settings-card settings-account-info"><p className="settings-label">Account information</p><p>Member since {new Date(user.createdAt).toLocaleDateString()}</p><a href="/dashboard">Return to dashboard →</a></section>
      </main>
    </div>
  )
}

export default SettingsPage
