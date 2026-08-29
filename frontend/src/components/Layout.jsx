import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

function Layout({ children }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="layout">
      <Header />
      <main className={`layout-main${isHome ? '' : ' layout-main--offset'}`}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
