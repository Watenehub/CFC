import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);

    // Close About dropdown when closing menu
    if (menuOpen) {
      setAboutOpen(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAboutOpen(false);
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <img
            src="/logo.png"
            alt="Cornerstone Family Chapel"
          />
          <span>Cornerstone</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-nav">

          <div className="nav-dropdown">
            <button className="nav-link">
              About <span className="arrow">⌄</span>
            </button>

            <div className="dropdown-menu">
              <Link to="/about">Our Church</Link>
              <Link to="/pastors">Pastors</Link>
              <Link to="/deacons">Deacons</Link>
              <Link to="/gallery">Gallery</Link>
            </div>
          </div>

          <Link to="/sermons" className="nav-link">
            Sermons
          </Link>

          <Link to="/watch-live" className="nav-link">
            Watch Live
          </Link>

          <Link to="/events" className="nav-link">
            Events
          </Link>

          <Link to="/ministries" className="nav-link">
            Ministries
          </Link>

          <Link to="/give" className="nav-link">
            Give
          </Link>

        </nav>

        {/* HAMBURGER BUTTON */}
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

      {/* MOBILE MENU */}
      <nav className={`mobile-menu ${menuOpen ? "active" : ""}`}>

        {/* ABOUT */}
        <div className="mobile-dropdown">

          <button
            className="mobile-menu-link mobile-about-button"
            onClick={() => setAboutOpen(!aboutOpen)}
          >
            <span>About</span>
            <span className={`mobile-arrow ${aboutOpen ? "rotate" : ""}`}>
              ⌄
            </span>
          </button>

          <div
            className={`mobile-submenu ${
              aboutOpen ? "submenu-active" : ""
            }`}
          >
            <Link to="/about" onClick={closeMenu}>Our Church</Link>
            <Link to="/pastors" onClick={closeMenu}>Pastors</Link>
            <Link to="/deacons" onClick={closeMenu}>Deacons</Link>
            <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
          </div>

        </div>

        {/* OTHER LINKS */}
        <Link to="/sermons" className="mobile-menu-link" onClick={closeMenu}>
          Sermons
        </Link>

        <Link to="/watch-live" className="mobile-menu-link" onClick={closeMenu}>
          Watch Live
        </Link>

        <Link to="/events" className="mobile-menu-link" onClick={closeMenu}>
          Events
        </Link>

        <Link to="/ministries" className="mobile-menu-link" onClick={closeMenu}>
          Ministries
        </Link>

        <Link to="/give" className="mobile-menu-link mobile-give" onClick={closeMenu}>
          Give
        </Link>

      </nav>

    </header>
  );
};

export default Header;
