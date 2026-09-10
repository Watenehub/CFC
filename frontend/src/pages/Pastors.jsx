import './About.css'
import { useState, useEffect } from 'react'
import * as pastorsApi from '../api/pastors'
import PageHero from '../components/PageHero'

function Pastors() {
  const [pastors, setPastors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPastors = async () => {
      try {
        const data = await pastorsApi.getPastors()
        setPastors(data)
      } catch (err) {
        setError('Failed to load pastors')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPastors()
  }, [])

  return (
    <div className="about">
      <PageHero
        eyebrow="Leadership"
        title="Our Pastors"
        subtitle="Meet the pastors who shepherd Cornerstone Family Chapel."
        image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
      />
      <div className="page-body">
        <div className="container">
          {loading && <div className="loading-state">Loading...</div>}
          {error && <div className="error-state">{error}</div>}
          {!loading && !error && pastors.length === 0 && (
            <div className="empty-state"><p>No pastors listed yet.</p></div>
          )}
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
        </div>
      </div>
    </div>
  )
}

export default Pastors
