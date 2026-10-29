import { useEffect, useRef, useState } from 'react'
import AuthField from '../components/AuthField.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/LoginPage.css'

const initialForm = { email: '', password: '', rememberMe: false }

function validateForm(form) {
  const errors = {}
  const email = form.email.trim()

  if (!email) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!form.password) {
    errors.password = 'Password is required.'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.'
  }

  return errors
}

function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef({})

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    const field = name === 'remember_me' ? 'rememberMe' : name

    setForm((current) => ({ ...current, [field]: type === 'checkbox' ? checked : value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
    setSuccess(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSuccess(false)
      setToast({ message: 'Please fix the highlighted fields and try again.', type: 'error' })
      const firstError = Object.keys(nextErrors)[0]
      window.setTimeout(() => inputRefs.current[firstError]?.focus(), 0)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      await login(form.email, form.password, form.rememberMe)
      setSuccess(true)
      setToast({ message: 'Signed in successfully.', type: 'success' })
      window.location.replace('/dashboard')
    } catch (error) {
      setToast({ message: error.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout actionLabel="Sign Up" actionHref="/signup">
      <div className="signup-grid login-grid">
        <div className="signup-intro">
          <div className="eyebrow"><span className="pulse-dot" />WELCOME BACK</div>
          <div className="intro-copy">
            <h1>Sign in to keep tracking suspicious job offers.</h1>
            <p>Access your saved reports, scam alerts, and verification history with a clean login screen that stays true to the TrustLens look.</p>
          </div>
          <div className="benefit-grid">
            {[
              ['Secure', 'simple authentication UI'],
              ['Fast', 'quick return to your tools'],
              ['Focused', 'only the essential fields'],
            ].map(([title, description]) => (
              <div className="benefit-card" key={title}>
                <p>{title}</p>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="signup-card">
          <div className="card-heading">
            <div>
              <p className="card-eyebrow">Login</p>
              <h2>Welcome back</h2>
            </div>
            <span className="free-badge">Secure</span>
          </div>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            {success && (
              <div className="success-banner" role="status" aria-live="polite">
                <span className="success-icon" aria-hidden="true">✓</span>
                <div>
                  <p>Signed in successfully.</p>
                  <span>You can now continue to your saved reports and scans.</span>
                </div>
              </div>
            )}

            <AuthField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={handleChange}
              inputRef={(element) => { inputRefs.current.email = element }}
            />
            <AuthField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              error={errors.password}
              onChange={handleChange}
              inputRef={(element) => { inputRefs.current.password = element }}
            />

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" name="remember_me" checked={form.rememberMe} onChange={handleChange} />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
          </form>

          <p className="signin-prompt">New to TrustLens? <a href="/signup">Create an account</a></p>
        </div>
      </div>
      {toast && <div className={`signup-toast ${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>{toast.message}</div>}
    </AuthLayout>
  )
}

export default LoginPage
