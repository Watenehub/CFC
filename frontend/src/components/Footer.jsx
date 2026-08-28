import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Cornerstone Family Chapel</h3>
            <p className="footer-description">
              A welcoming community of faith, worshiping together and growing in Christ.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/ministries">Ministries</Link></li>
              <li><Link to="/sermons">Sermons</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/give">Give</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Service Times</h4>
            <ul className="footer-info">
              <li>Sunday Worship: 9:00 AM</li>
              <li>Sunday School: 10:30 AM</li>
              <li>Bible Study: Wednesday 7:00 PM</li>
              <li>Prayer Meeting: Friday 6:00 PM</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-info">
              <li>123 Church Street</li>
              <li>Nairobi, Kenya</li>
              <li>Phone: +254 700 000 000</li>
              <li>Email: info@cornerstonechapel.org</li>
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
