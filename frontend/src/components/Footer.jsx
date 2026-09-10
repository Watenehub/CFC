import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as settingsApi from '../api/settings'
import './Footer.css'

function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    settingsApi.getSettings()
      .then(setSettings)
      .catch(() => {})
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="Cornerstone Family Chapel" />
              <span>{settings?.church_name || 'Cornerstone Family Chapel'}</span>
            </Link>
            <p className="footer-tagline">
              Growing in faith. Serving with love. Reaching our community.
            </p>
            {settings && (
              <div className="footer-contact-details">
                {settings.address && <p>{settings.address}</p>}
                {settings.phone && <p><a href={`tel:${settings.phone}`}>{settings.phone}</a></p>}
                {settings.email && <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>}
                {settings.office_hours && <p>{settings.office_hours}</p>}
              </div>
            )}
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/watch-live">Watch Live</Link></li>
                <li><Link to="/sermons">Sermons</Link></li>
                <li><Link to="/events">Events</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Serve</h4>
              <ul>
                <li><Link to="/ministries">Ministries</Link></li>
                <li><Link to="/prayer">Prayer</Link></li>
                <li><Link to="/give">Give</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><Link to="/contact">Get in Touch</Link></li>
                <li><Link to="/pastors">Pastors</Link></li>
                <li><Link to="/deacons">Deacons</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings?.church_name || 'Cornerstone Family Chapel'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
