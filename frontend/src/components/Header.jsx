import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setAboutOpen(false)
  }, [location.pathname])

  const navLinks = [
    { path: '/sermons', label: 'Sermons' },
    { path: '/watch-live', label: 'Watch Live' },
    { path: '/events', label: 'Events' },
    { path: '/ministries', label: 'Ministries' },
    { path: '/give', label: 'Give' },
  ]

  const isActive = (path) => location.pathname === path

  const headerClass = [
    'header',
    isHome && !scrolled ? 'header--transparent' : 'header--solid',
    mobileMenuOpen ? 'header--menu-open' : '',
  ].filter(Boolean).join(' ')

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <Link to="/" className="logo">
          <img
            src="/logo.png"
            alt="Cornerstone Family Chapel"
            className="logo-image"
          />
          <span className="logo-text">Cornerstone</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          <div className="mobile-nav-header">
            <Link to="/" className="mobile-nav-brand" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Cornerstone Family Chapel" />
            </Link>
            <button type="button" className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">&times;</button>
          </div>
          <ul className="nav-list desktop-nav-list">
            <li className="nav-item nav-about">
              <button
                type="button"
                className={`nav-link about-link ${isActive('/about') || isActive('/pastors') || isActive('/deacons') ? 'nav-link-active' : ''}`}
                aria-expanded={aboutOpen}
                onClick={() => setAboutOpen(!aboutOpen)}
              >
                About
                <svg className="caret" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </button>
              <ul className={`dropdown ${aboutOpen ? 'open' : ''}`}>
                <li><Link to="/about" className="dropdown-link" onClick={() => setAboutOpen(false)}>Our Church</Link></li>
                <li><Link to="/pastors" className="dropdown-link" onClick={() => setAboutOpen(false)}>Pastors</Link></li>
                <li><Link to="/deacons" className="dropdown-link" onClick={() => setAboutOpen(false)}>Deacons</Link></li>
                <li><Link to="/gallery" className="dropdown-link" onClick={() => setAboutOpen(false)}>Gallery</Link></li>
              </ul>
            </li>

            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="nav-item nav-item-mobile-only">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>

            {!user && (
              <li className="nav-item nav-item-mobile-only">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            )}
          </ul>
          <ul className="mobile-nav-list">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li className="mobile-nav-about-item">
              <button type="button" onClick={() => setAboutOpen(!aboutOpen)} aria-expanded={aboutOpen}>
                <span>About Us</span><span className="mobile-nav-plus">{aboutOpen ? '-' : '+'}</span>
              </button>
              {aboutOpen && (
                <ul className="mobile-nav-submenu">
                  <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>Our Church</Link></li>
                  <li><Link to="/pastors" onClick={() => setMobileMenuOpen(false)}>Pastors</Link></li>
                  <li><Link to="/deacons" onClick={() => setMobileMenuOpen(false)}>Deacons</Link></li>
                  <li><Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link></li>
                </ul>
              )}
            </li>
            <li><Link to="/sermons" onClick={() => setMobileMenuOpen(false)}>Sermons</Link></li>
            <li><Link to="/give" onClick={() => setMobileMenuOpen(false)}>Giving</Link></li>
            <li><Link to="/events" onClick={() => setMobileMenuOpen(false)}>Events</Link></li>
            <li><Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Downloads</Link></li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link></li>
          </ul>
          <form className="mobile-nav-search" onSubmit={(event) => event.preventDefault()}>
            <input type="search" placeholder="Search.." aria-label="Search website" />
            <button type="submit" aria-label="Search">&#8594;</button>
          </form>
        </nav>

        {mobileMenuOpen && (
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="header-actions">
          <Link to="/contact" className="header-cta header-cta--ghost">Contact</Link>
          <Link to="/watch-live" className="header-cta header-cta--primary">Watch Live</Link>

          {user ? (
            <div className="user-menu">
              <Link to="/dashboard" className="header-cta header-cta--ghost">Dashboard</Link>
              <button type="button" onClick={logout} className="header-cta header-cta--ghost">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="header-cta header-cta--ghost header-login-desktop">Login</Link>
          )}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
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
    </header>
  )
}

export default Header
