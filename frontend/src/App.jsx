import { useAuth } from './context/AuthContext.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DetectorPage from './pages/DetectorPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ImageSliderPage from './pages/ImageSliderPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ScanDetailPage from './pages/ScanDetailPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading && (path === '/dashboard' || path === '/login' || path === '/signup' || path === '/settings' || path.startsWith('/scans/'))) {
    return <main className="app-loading">Loading TrustLens…</main>
  }

  if ((path === '/dashboard' || path === '/settings' || path.startsWith('/scans/')) && !isAuthenticated) {
    window.location.replace('/login')
    return null
  }

  if ((path === '/login' || path === '/signup') && isAuthenticated) {
    window.location.replace('/dashboard')
    return null
  }

  if (path === '/login') return <LoginPage />
  if (path === '/signup') return <SignupPage />
  if (path === '/dashboard') return <DashboardPage />
  if (path === '/settings') return <SettingsPage />
  if (path.startsWith('/scans/')) return <ScanDetailPage scanId={path.slice('/scans/'.length)} />
  if (path === '/detector') return <DetectorPage />
  if (path === '/image-slider') return <ImageSliderPage />
  return <HomePage />
}

export default App
