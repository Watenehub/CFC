import './About.css'
import { useState, useEffect } from 'react'
import * as pastorsApi from '../api/pastors'
import * as deaconsApi from '../api/deacons'
import PageHero from '../components/PageHero'

function Staff() {
  const [pastors, setPastors] = useState([])
  const [deacons, setDeacons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const [pastorsData, deaconsData] = await Promise.all([
          pastorsApi.getPastors(),
          deaconsApi.getDeacons()
        ])
        setPastors(pastorsData || [])
        setDeacons(deaconsData || [])
      } catch (err) {
        setError('Failed to load staff information')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStaff()
  }, [])

  return (
    <div className="about">
      <PageHero
        eyebrow="Leadership"
        title="Our Staff"
        subtitle="Meet the pastors and deacons who serve and lead Cornerstone Family Chapel."
        image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
      />
      <div className="page-body">
        <div className="container">
          {loading && <div className="loading-state">Loading...</div>}
          {error && <div className="error-state">{error}</div>}
          
          {!loading && !error && (
            <>
              {pastors.length > 0 && (
                <>
                  <h2 className="section-heading">Pastors</h2>
                  <div className="leadership-grid">
                    {pastors.map((pastor) => (
                      <article key={pastor.id || `${pastor.name}-${pastor.title}`} className="leader-card">
                        <div className="leadership-portrait-frame">
                          <div className="leadership-outer-ring"></div>
                          <div className="leadership-inner-ring"></div>
                          <img src={pastor.image || '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg'} alt={pastor.name} className="leadership-photo" />
                        </div>
                        <h3>{pastor.name}</h3>
                        <p className="leader-title">{pastor.title}</p>
                        <p className="leader-bio">{pastor.bio}</p>
                        {pastor.encouragement && <p className="leader-encouragement">{pastor.encouragement}</p>}
                      </article>
                    ))}
                  </div>
                </>
              )}

              {deacons.length > 0 && (
                <>
                  <h2 className="section-heading" style={{ marginTop: '40px' }}>Deacons</h2>
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
                </>
              )}

              {pastors.length === 0 && deacons.length === 0 && (
                <div className="empty-state"><p>No staff members listed yet.</p></div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Staff
