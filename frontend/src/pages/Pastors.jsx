import { useState, useEffect } from 'react'
import * as pastorsApi from '../api/pastors'
import PageHero from '../components/PageHero'
import Leadership from '../components/Leadership'

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
          {!loading && !error && pastors.length > 0 && (
            <Leadership
              title="Our Pastors"
              subtitle="Meet the pastors who shepherd Cornerstone Family Chapel."
              members={pastors}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Pastors
