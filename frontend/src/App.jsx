import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Routes from './routes'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes />
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App
