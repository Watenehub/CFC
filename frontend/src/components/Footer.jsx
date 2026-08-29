import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="Cornerstone Family Chapel" />
              <span>Cornerstone Family Chapel</span>
            </Link>
            <p className="footer-tagline">
              Growing in faith. Serving with love. Reaching our community.
            </p>
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
          <p>&copy; {new Date().getFullYear()} Cornerstone Family Chapel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
