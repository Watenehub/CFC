import './About.css'

function Deacons() {
  return (
    <div className="about">
      <div className="container">
        <section className="about-hero">
          <h1>Our Deacons</h1>
          <p className="about-subtitle">Meet the deacons who serve our church in various ministries.</p>
        </section>

        <section className="about-section">
          <div className="leadership-grid">
            <div className="leader-card">
              <div className="leader-image">
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Deacon" />
              </div>
              <h3>Deacon Samuel Opiyo</h3>
              <p className="leader-bio">Serving in community outreach and member care.</p>
            </div>

            <div className="leader-card">
              <div className="leader-image">
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Deacon" />
              </div>
              <h3>Deaconess Mercy Wanjiru</h3>
              <p className="leader-bio">Oversees hospitality and small groups.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Deacons
