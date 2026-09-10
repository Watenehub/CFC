import './About.css'
import { useState, useEffect } from 'react'
import * as deaconsApi from '../api/deacons'
import PageHero from '../components/PageHero'

function Deacons() {
  const [deacons, setDeacons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDeacons = async () => {
      try {
        const data = await deaconsApi.getDeacons()
        setDeacons(data)
      } catch (err) {
        setError('Failed to load deacons')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDeacons()
  }, [])

  return (
    <div className="about">
      <PageHero
        eyebrow="Leadership"
        title="Our Deacons"
        subtitle="Meet the deacons who serve our church family in care, hospitality, and outreach."
        image="/CFC_CHURCH_PHOTO.jpg"
      />
      <div className="page-body">
        <div className="container">
          {loading && <div className="loading-state">Loading...</div>}
          {error && <div className="error-state">{error}</div>}
          {!loading && !error && deacons.length === 0 && (
            <div className="empty-state"><p>No deacons listed yet.</p></div>
          )}
          <div className="leadership-grid">
            {deacons.map((member) => (
              <article key={member.id || `${member.name}-${member.role}`} className="leader-card">
                <div className="leader-image">
                  <img src={member.image || '/CFC_CHURCH_PHOTO.jpg'} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="leader-bio">{member.role || member.title}</p>
                {member.encouragement && <p className="leader-encouragement">{member.encouragement}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Deacons
