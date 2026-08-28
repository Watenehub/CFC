import './About.css'

function Pastors() {
  return (
    <div className="about">
      <div className="container">
        <section className="about-hero">
          <h1>Our Pastors</h1>
          <p className="about-subtitle">Meet the pastors who lead and shepherd our congregation.</p>
        </section>

        <section className="about-section">
          <div className="leadership-grid">
            <div className="leader-card">
              <div className="leader-image">
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Senior Pastor" />
              </div>
              <h3>Pastor John Doe</h3>
              <p className="leader-title">Senior Pastor</p>
              <p className="leader-bio">Leading our congregation with wisdom and grace for over 15 years.</p>
            </div>

            <div className="leader-card">
              <div className="leader-image">
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Associate Pastor" />
              </div>
              <h3>Pastor Jane Smith</h3>
              <p className="leader-title">Associate Pastor</p>
              <p className="leader-bio">Overseeing our ministries and discipleship programs.</p>
            </div>

            <div className="leader-card">
              <div className="leader-image">
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Youth Pastor" />
              </div>
              <h3>Pastor Michael Johnson</h3>
              <p className="leader-title">Youth Pastor</p>
              <p className="leader-bio">Guiding our youth in faith and service.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Pastors
