import './About.css'

function Pastors() {
  return (
    <div className="about">
      <div className="container">
        <section className="about-hero">
          <h1>Our Pastor</h1>
          <p className="about-subtitle">Meet the Senior Pastor who shepherds our congregation.</p>
        </section>

        <section className="about-section">
          <div className="leadership-grid single">
            <div className="leader-card">
              <div className="leadership-portrait-frame">
                <div className="leadership-outer-ring"></div>
                <div className="leadership-inner-ring"></div>
                <img src="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg" alt="Pastor Nahashon Wachira" className="leadership-photo" />
              </div>
              <h3>Nahashon Wachira</h3>
              <p className="leader-title">Senior Pastor</p>
              <p className="leader-bio">Senior Pastor of Cornerstone Family Chapel. Committed to discipleship, faithful preaching of God’s Word, and shepherding the congregation in love and truth.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Pastors
