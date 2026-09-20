import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Routes from './routes'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Layout>
          <Routes />
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App
