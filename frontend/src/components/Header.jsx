import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/sermons', label: 'Sermons' },
    { path: '/watch-live', label: 'Watch Live' },
    { path: '/events', label: 'Events' },
    { path: '/give', label: 'Give' },
    { path: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img 
              src="/logo.png" 
              alt="Cornerstone Family Chapel"
              className="logo-image"
            />
            <span className="logo-text" style={{ color: 'var(--color-primary)' }}>Cornerstone Family Chapel</span>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              {navLinks.map((link) => (
                link.path === '/about' ? (
                  <li key={link.path} className="nav-item nav-about" onMouseLeave={() => setAboutOpen(false)}>
                    <div
                      className={`nav-link about-link ${isActive('/about') ? 'nav-link-active' : ''}`}
                      onClick={() => { setMobileMenuOpen(false); if (window.innerWidth <= 1024) setAboutOpen(!aboutOpen); }}
                    >
                      <span>{link.label}</span>
                      <button
                        className="caret-btn"
                        aria-expanded={aboutOpen}
                        aria-label="Toggle About submenu"
                        onClick={(e) => { e.stopPropagation(); setAboutOpen(!aboutOpen) }}
                      >
                        ▾
                      </button>
                    </div>

                    <ul className={`dropdown ${aboutOpen ? 'open' : ''}`}>
                      <li><Link to="/about#our-church" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setAboutOpen(false); }}>Our Church</Link></li>
                      <li><Link to="/pastors" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setAboutOpen(false); }}>Pastors</Link></li>
                      <li><Link to="/deacons" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setAboutOpen(false); }}>Deacons</Link></li>
                    </ul>
                  </li>
                ) : (
                  <li key={link.path} className="nav-item">
                    <Link 
                      to={link.path} 
                      className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              ))}

              {!user && (
                <li className="nav-item nav-login">
                  <Link 
                    to="/login" 
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="header-actions">
            <button className="search-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {user ? (
              <div className="user-menu">
                <Link to="/dashboard" className="dashboard-btn">
                  Dashboard
                </Link>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              </div>
            )}

            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
