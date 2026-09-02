import './About.css'
import { readSiteContent } from '../data/siteContent'
import { useState, useEffect } from 'react'

function Deacons() {
  const [deacons, setDeacons] = useState(readSiteContent().deacons)

  useEffect(() => {
    const updateDeacons = () => setDeacons(readSiteContent().deacons)
    updateDeacons()
    window.addEventListener('cornerstone-content-updated', updateDeacons)
    return () => window.removeEventListener('cornerstone-content-updated', updateDeacons)
  }, [])

  const leaders = deacons.length ? deacons : [
    { name: 'Deacon Samuel Opiyo', role: 'Community outreach and member care', image: '/CFC_CHURCH_PHOTO.jpg' },
    { name: 'Deaconess Mercy Wanjiru', role: 'Hospitality and small groups', image: '/CFC_CHURCH_PHOTO.jpg' },
  ]

  return (
    <div className="about">
      <div className="container">
        <section className="about-hero">
          <h1>Our Deacons</h1>
          <p className="about-subtitle">Meet the deacons who serve our church in various ministries.</p>
        </section>

        <section className="about-section">
          <div className="leadership-grid">
            {leaders.map((member) => (
              <div key={`${member.name}-${member.role}`} className="leader-card">
                <div className="leader-image">
                  <img src={member.image || '/CFC_CHURCH_PHOTO.jpg'} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="leader-bio">{member.role}</p>
                {member.encouragement && <p className="leader-encouragement">{member.encouragement}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Deacons
