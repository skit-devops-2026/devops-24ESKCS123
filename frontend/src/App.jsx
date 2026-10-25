import DashboardPage from './pages/DashboardPage.jsx'
import DetectorPage from './pages/DetectorPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ImageSliderPage from './pages/ImageSliderPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/login') return <LoginPage />
  if (path === '/signup') return <SignupPage />
  if (path === '/dashboard') return <DashboardPage />
  if (path === '/detector') return <DetectorPage />
  if (path === '/image-slider') return <ImageSliderPage />
  return <HomePage />
}

export default App
