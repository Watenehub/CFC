import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardPath as pathForRole } from '../utils/permissions'
import './Header.css'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    if (menuOpen) setAboutOpen(false)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setAboutOpen(false)
  }

  const dashboardPath = pathForRole(user?.role)

  const handleLogout = async () => {
    closeMenu()
    try {
      await logout()
    } finally {
      window.location.href = '/'
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Cornerstone Family Chapel" />
          <span>Cornerstone</span>
        </Link>

        <nav className="desktop-nav">
          <div className="nav-dropdown">
            <button type="button" className="nav-link">
              About <span className="arrow">⌄</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/about">Our Church</Link>
              <Link to="/pastors">Pastors</Link>
              <Link to="/deacons">Deacons</Link>
              <Link to="/gallery">Gallery</Link>
            </div>
          </div>

          <Link to="/sermons" className="nav-link">Sermons</Link>
          <Link to="/watch-live" className="nav-link">Watch Live</Link>
          <Link to="/events" className="nav-link">Events</Link>
          <Link to="/ministries" className="nav-link">Ministries</Link>
          <Link to="/prayer" className="nav-link">Prayer</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/give" className="nav-link nav-give">Give</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="nav-link nav-staff">Dashboard</Link>
              <button type="button" className="nav-link nav-logout" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <Link to="/login" className="nav-link nav-staff">Staff login</Link>
          )}
        </nav>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <div className="mobile-dropdown">
          <button
            type="button"
            className="mobile-menu-link mobile-about-button"
            onClick={() => setAboutOpen(!aboutOpen)}
          >
            <span>About</span>
            <span className={`mobile-arrow ${aboutOpen ? 'rotate' : ''}`}>⌄</span>
          </button>
          <div className={`mobile-submenu ${aboutOpen ? 'submenu-active' : ''}`}>
            <Link to="/about" onClick={closeMenu}>Our Church</Link>
            <Link to="/pastors" onClick={closeMenu}>Pastors</Link>
            <Link to="/deacons" onClick={closeMenu}>Deacons</Link>
            <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
          </div>
        </div>

        <Link to="/sermons" className="mobile-menu-link" onClick={closeMenu}>Sermons</Link>
        <Link to="/watch-live" className="mobile-menu-link" onClick={closeMenu}>Watch Live</Link>
        <Link to="/events" className="mobile-menu-link" onClick={closeMenu}>Events</Link>
        <Link to="/ministries" className="mobile-menu-link" onClick={closeMenu}>Ministries</Link>
        <Link to="/prayer" className="mobile-menu-link" onClick={closeMenu}>Prayer</Link>
        <Link to="/contact" className="mobile-menu-link" onClick={closeMenu}>Contact</Link>
        <Link to="/give" className="mobile-menu-link mobile-give" onClick={closeMenu}>Give</Link>
        {isAuthenticated ? (
          <>
            <Link to={dashboardPath} className="mobile-menu-link" onClick={closeMenu}>Dashboard</Link>
            <button type="button" className="mobile-menu-link mobile-logout" onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <Link to="/login" className="mobile-menu-link" onClick={closeMenu}>Staff login</Link>
        )}
      </nav>
    </header>
  )
}

export default Header
