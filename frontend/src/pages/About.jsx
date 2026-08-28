import './About.css'

function About() {
  return (
    <div className="about">
      <div className="container">
        <section className="about-hero">
          <h1>About Cornerstone Family Chapel</h1>
          <p className="about-subtitle">
            A community of faith committed to worship, growth, and service
          </p>
        </section>

        <section id="our-church" className="about-section">
          <h2>Our Church</h2>

          <div className="church-block">
            <h3>Our Story</h3>
            <p>
              Cornerstone Family Chapel was founded with a vision to create a welcoming space where people 
              from all walks of life can encounter God, grow in their faith, and build meaningful relationships. 
              Since our beginning, we have been dedicated to teaching the truth of Scripture, serving our community, 
              and spreading the love of Christ.
            </p>

            <h3>Our Mission</h3>
            <p>
              To glorify God by making disciples of Jesus Christ who love God, love one another, and serve the world 
              with the gospel.
            </p>

            <h3>Our Vision</h3>
            <p>
              To be a vibrant, growing church that transforms our community and the world through the power of the gospel, 
              authentic worship, compassionate service, and intentional discipleship.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>What We Believe</h2>
          <div className="beliefs-list">
            <div className="belief-item">
              <h3>The Bible</h3>
              <p>We believe the Bible is the inspired Word of God, authoritative and without error.</p>
            </div>
            <div className="belief-item">
              <h3>God</h3>
              <p>We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit.</p>
            </div>
            <div className="belief-item">
              <h3>Jesus Christ</h3>
              <p>We believe Jesus Christ is the Son of God, fully God and fully man, who died for our sins and rose again.</p>
            </div>
            <div className="belief-item">
              <h3>Salvation</h3>
              <p>We believe salvation is by grace through faith in Jesus Christ alone.</p>
            </div>
            <div className="belief-item">
              <h3>The Church</h3>
              <p>We believe the church is the body of Christ, called to worship, grow, and serve together.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Service Times</h2>
          <div className="service-times">
            <div className="service-time-item">
              <h3>Sunday Worship</h3>
              <p>9:00 AM - 11:00 AM</p>
            </div>
            <div className="service-time-item">
              <h3>Sunday School</h3>
              <p>10:30 AM - 11:30 AM</p>
            </div>
            <div className="service-time-item">
              <h3>Wednesday Bible Study</h3>
              <p>7:00 PM - 8:30 PM</p>
            </div>
            <div className="service-time-item">
              <h3>Friday Prayer Meeting</h3>
              <p>6:00 PM - 7:30 PM</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Location</h2>
          <div className="location-info">
            <p><a href="https://maps.app.goo.gl/EqJokxhmrrGCL4qZ6" target="_blank" rel="noopener noreferrer">123 Church Street, Nairobi, Kenya</a></p>
            <p>Phone: +254 700 000 000</p>
            <p>Email: info@cornerstonechapel.org</p>
          </div>
        </section>

        {/* Leadership removed as requested; use dedicated /pastors and /deacons pages instead */}
      </div>
    </div>
  )
}

export default About
