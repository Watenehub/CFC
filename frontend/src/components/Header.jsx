import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as settingsApi from '../api/settings'
import './Header.css'

const getInvolvedLinks = [
  { path: '/', label: 'Visit Cornerstone', subtitle: 'Find service times and location', icon: 'home' },
  { path: '/watch-live', label: 'Watch Live', subtitle: 'Join us from anywhere', icon: 'live', live: true },
  { path: '/ministries', label: 'Ministries', subtitle: 'Relationships to grow your faith', icon: 'groups' },
  { path: '/give', label: 'Give', subtitle: 'Generosity in action', icon: 'give' },
  { path: '/events', label: 'Events', subtitle: 'Meaningful experiences', icon: 'events' },
  { path: '/prayer', label: 'Need Prayer?', subtitle: 'Support through faith', icon: 'prayer' },
]

const discoverLinks = [
  { path: '/sermons', label: 'Sermons', icon: 'sermons' },
  { path: '/gallery', label: 'Gallery', icon: 'gallery' },
  { path: '/about', label: 'Our Church', icon: 'church' },
  { path: '/pastors', label: 'Pastors', icon: 'people' },
  { path: '/deacons', label: 'Deacons', icon: 'people' },
  { path: '/contact', label: 'Contact Us', icon: 'contact' },
]

function NavIcon({ name }) {
  const icons = {
    home: 'M4 11.5 12 5l8 6.5M6 10v9h5v-5h2v5h5v-9',
    live: 'M12 7v10M8 9.5v5M16 9.5v5M4 8v8M20 8v8',
    groups: 'M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 19c.6-2.8 2.6-4.5 5-4.5s4.4 1.7 5 4.5M14.5 19c.4-2.2 1.8-3.6 3.8-3.6S21.7 16.8 22 19',
    give: 'M12 21s-6.5-4.2-9-8.2C1.2 9.6 3 6 6.3 6c1.9 0 3.3 1 4 2.3M12 21s6.5-4.2 9-8.2C22.8 9.6 21 6 17.7 6c-1.9 0-3.3 1-4 2.3',
    events: 'M4 9h16M6 4v3M18 4v3M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
    prayer: 'M8 3v6l-3 3v9M16 3v6l3 3v9M8 9h8',
    sermons: 'M6 4h9l3 3v13H6zM15 4v3h3M9 11h6M9 14h6M9 17h4',
    gallery: 'M4 5h16v14H4zM8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM4 16l5-5 4 4 3-3 4 4',
    church: 'M12 3l2 3h-4l2-3ZM11 6v3H8v10h8V9h-3V6M6 19h12',
    people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c.6-3 2.8-5 6-5s5.4 2 6 5',
    contact: 'M4 5h16v14l-4-3H4z',
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={icons[name] || icons.home} />
    </svg>
  )
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLive, setIsLive] = useState(false)
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
    let isMounted = true
    settingsApi.getSettings()
      .then((data) => { if (isMounted) setIsLive(Boolean(data?.is_live)) })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setAboutOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

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
                  {link.path === '/watch-live' && isLive && <span className="live-pulse live-pulse--inline" aria-hidden="true" />}
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
            <li className="mobile-nav-group-label">Get Involved</li>
            {getInvolvedLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} onClick={() => setMobileMenuOpen(false)}>
                  <span className="mobile-nav-icon"><NavIcon name={link.icon} /></span>
                  <span className="mobile-nav-text">
                    <strong>{link.label}</strong>
                    <span className="mobile-nav-subtitle">{link.subtitle}</span>
                  </span>
                  {link.live && isLive && <span className="mobile-nav-live-dot" aria-label="Live now" />}
                </Link>
              </li>
            ))}
            <li className="mobile-nav-group-label">Discover</li>
            {discoverLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.path} onClick={() => setMobileMenuOpen(false)}>
                  <span className="mobile-nav-icon"><NavIcon name={link.icon} /></span>
                  <span className="mobile-nav-text"><strong>{link.label}</strong></span>
                </Link>
              </li>
            ))}
            {!user && (
              <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <span className="mobile-nav-icon"><NavIcon name="people" /></span>
                <span className="mobile-nav-text"><strong>Login</strong></span>
              </Link></li>
            )}
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
          <Link to="/watch-live" className={`header-cta header-cta--primary${isLive ? ' is-live' : ''}`}>
            {isLive && <span className="live-pulse" aria-hidden="true" />}
            Watch Live
          </Link>

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
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 7L21 21M7 21L21 7" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 8H24M4 14H24M4 20H24" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
