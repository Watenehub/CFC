import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Cornerstone Family Chapel</h3>
            <p className="footer-tagline">
              Growing in faith. Serving with love. Reaching our community.
            </p>
            <p className="footer-description">
              Join us as we worship, learn, fellowship, and serve together.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/ministries">Ministries</Link></li>
              <li><Link to="/sermons">Sermons</Link></li>
              <li><Link to="/watch-live">Watch Live</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/prayer">Prayer</Link></li>
              <li><Link to="/give">Give</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Service Times</h4>
            <ul className="footer-info">
              <li><em>Service times to be updated</em></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-info">
              <li><em>Address to be updated</em></li>
              <li><em>Phone to be updated</em></li>
              <li><em>Email to be updated</em></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Cornerstone Family Chapel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
