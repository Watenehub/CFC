import './About.css'
import { readSiteContent } from '../data/siteContent'
import { useState, useEffect } from 'react'

function Pastors() {
  const [pastors, setPastors] = useState(readSiteContent().pastors)

  useEffect(() => {
    const updatePastors = () => setPastors(readSiteContent().pastors)
    updatePastors()
    window.addEventListener('cornerstone-content-updated', updatePastors)
    return () => window.removeEventListener('cornerstone-content-updated', updatePastors)
  }, [])

  const leaders = pastors.length ? pastors : [{
    name: 'Nahashon Wachira',
    title: 'Senior Pastor',
    bio: 'Senior Pastor of Cornerstone Family Chapel. Committed to discipleship, faithful preaching of God’s Word, and shepherding the congregation in love and truth.',
    image: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
  }]

  return (
    <div className="about">
      <div className="container">
        <section className="about-hero">
          <h1>Our Pastor</h1>
          <p className="about-subtitle">Meet the Senior Pastor who shepherds our congregation.</p>
        </section>

        <section className="about-section">
          <div className="leadership-grid">
            {leaders.map((pastor) => (
              <div key={`${pastor.name}-${pastor.title}`} className="leader-card">
                <div className="leadership-portrait-frame">
                  <div className="leadership-outer-ring"></div>
                  <div className="leadership-inner-ring"></div>
                  <img src={pastor.image || '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg'} alt={pastor.name} className="leadership-photo" />
                </div>
                <h3>{pastor.name}</h3>
                <p className="leader-title">{pastor.title}</p>
                <p className="leader-bio">{pastor.bio}</p>
                {pastor.encouragement && <p className="leader-encouragement">{pastor.encouragement}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Pastors
