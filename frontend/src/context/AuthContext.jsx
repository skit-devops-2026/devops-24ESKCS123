import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ApiError } from '../api/client.js'
import { getCurrentUser, login as loginRequest, signup as signupRequest } from '../api/auth.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'trustlens_token'

function readStoredSession() {
  const localToken = window.localStorage.getItem(TOKEN_KEY)
  if (localToken) return { token: localToken, storage: window.localStorage }

  const sessionToken = window.sessionStorage.getItem(TOKEN_KEY)
  if (sessionToken) return { token: sessionToken, storage: window.sessionStorage }

  return { token: null, storage: null }
}

function clearStoredSession() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.sessionStorage.removeItem(TOKEN_KEY)
}

function saveSession(token, rememberMe) {
  clearStoredSession()
  const storage = rememberMe ? window.localStorage : window.sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession())
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      if (!session.token) {
        if (active) setIsLoading(false)
        return
      }

      try {
        const response = await getCurrentUser(session.token)
        if (active) setUser(response.user)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearStoredSession()
          if (active) {
            setSession({ token: null, storage: null })
            setUser(null)
          }
        } else {
          console.error('Unable to restore the TrustLens session.', error)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    restoreSession()
    return () => { active = false }
  }, [session.token])

  const authenticate = (response, rememberMe) => {
    saveSession(response.token, rememberMe)
    setSession({ token: response.token, storage: rememberMe ? window.localStorage : window.sessionStorage })
    setUser(response.user)
  }

  const login = async (email, password, rememberMe) => {
    const response = await loginRequest(email, password)
    authenticate(response, rememberMe)
    return response.user
  }

  const signup = async (details) => {
    const response = await signupRequest(details)
    authenticate(response, true)
    return response.user
  }

  const logout = () => {
    clearStoredSession()
    setSession({ token: null, storage: null })
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    token: session.token,
    isLoading,
    isAuthenticated: Boolean(user && session.token),
    login,
    signup,
    logout,
  }), [isLoading, session.token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
