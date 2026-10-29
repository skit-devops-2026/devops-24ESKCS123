import { useEffect, useRef, useState } from 'react'
import AuthField from '../components/AuthField.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  goal: 'check_job_offers',
  updates: false,
}

const validateForm = (form) => {
  const errors = {}
  const name = form.fullName.trim()
  const email = form.email.trim()

  if (!name) {
    errors.fullName = 'Full name is required.'
  } else if (name.length < 2) {
    errors.fullName = 'Name must be at least 2 characters long.'
  } else if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    errors.fullName = 'Use letters and spaces only.'
  }

  if (!email) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!form.password) {
    errors.password = 'Password is required.'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.'
  } else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Password must include letters and numbers.'
  }

  if (!form.goal) {
    errors.goal = 'Please select a primary goal.'
  }

  return errors
}

function SignupPage() {
  const { signup } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef({})

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeout = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    const field = name === 'full_name' ? 'fullName' : name

    setForm((current) => ({
      ...current,
      [field]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => {
      if (!current[field]) {
        return current
      }

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
      await signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        goal: form.goal,
        updates: form.updates,
      })
      setSuccess(true)
      setToast({ message: 'Account created successfully!', type: 'success' })
      window.location.replace('/dashboard')
    } catch (error) {
      setToast({ message: error.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout actionLabel="Back to Home" actionHref="/">
      <div className="signup-grid">
            <div className="signup-intro">
              <div className="eyebrow"><span className="pulse-dot" />JOIN TRUSTLENS</div>
              <div className="intro-copy">
                <h1>Create your account and stay ahead of scam offers.</h1>
                <p>
                  Sign up to track suspicious job postings, get scam alerts, and keep your job search protected without sharing unnecessary personal details.
                </p>
              </div>

              <div className="benefit-grid">
                {[
                  ['Free', 'simple account access'],
                  ['Fast', 'no long onboarding'],
                  ['Safe', 'minimal data collection'],
                ].map(([title, description]) => (
                  <div className="benefit-card" key={title}>
                    <p>{title}</p>
                    <span>{description}</span>
                  </div>
                ))}
              </div>

              <div className="request-card">
                <p>What we ask for:</p>
                <span>Only the essentials needed for account creation and future personalization: name, email, password, and job-search goals.</span>
              </div>
            </div>

            <div className="signup-card">
              <div className="card-heading">
                <div>
                  <p className="card-eyebrow">Create account</p>
                  <h2>Join TrustLens</h2>
                </div>
                <span className="free-badge">Free</span>
              </div>

              <form className="signup-form" onSubmit={handleSubmit} noValidate>
                {success && (
                  <div className="success-banner" role="status" aria-live="polite">
                    <span className="success-icon" aria-hidden="true">✓</span>
                    <div>
                      <p>Account created successfully.</p>
                      <span>Your signup details are ready to be sent to the backend when you connect it.</span>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <AuthField
                    label="Full name"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    error={errors.fullName}
                    onChange={handleChange}
                    inputRef={(element) => { inputRefs.current.fullName = element }}
                  />
                  <AuthField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    error={errors.email}
                    onChange={handleChange}
                    inputRef={(element) => { inputRefs.current.email = element }}
                  />
                </div>

                <AuthField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={form.password}
                  error={errors.password}
                  onChange={handleChange}
                  inputRef={(element) => { inputRefs.current.password = element }}
                />

                <div className="field-group">
                  <label htmlFor="goal">Primary goal</label>
                  <select
                    id="goal"
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    ref={(element) => { inputRefs.current.goal = element }}
                    aria-invalid={Boolean(errors.goal)}
                    className={errors.goal ? 'has-error' : ''}
                  >
                    <option value="check_job_offers">Check if a job offer is legitimate</option>
                    <option value="get_scam_alerts">Get scam alerts and updates</option>
                    <option value="career_support">Track career opportunities safely</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.goal && <ErrorMessage message={errors.goal} />}
                </div>

                <label className="updates-option">
                  <input type="checkbox" name="updates" checked={form.updates} onChange={handleChange} />
                  <span>I agree to receive scam alerts and platform updates relevant to my job search.</span>
                </label>

                <button type="submit" className="submit-button" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create my account'}</button>
              </form>

              <p className="signin-prompt">
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </div>
          </div>
      {toast && <div className={`signup-toast ${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>{toast.message}</div>}
    </AuthLayout>
  )
}

export default SignupPage
