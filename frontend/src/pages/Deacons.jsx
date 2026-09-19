import { useState, useEffect } from 'react'
import * as deaconsApi from '../api/deacons'
import PageHero from '../components/PageHero'
import Leadership from '../components/Leadership'

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
        image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
      />
      <div className="page-body">
        <div className="container">
          {loading && <div className="loading-state">Loading...</div>}
          {error && <div className="error-state">{error}</div>}
          {!loading && !error && deacons.length === 0 && (
            <div className="empty-state"><p>No deacons listed yet.</p></div>
          )}
          {!loading && !error && deacons.length > 0 && (
            <Leadership
              title="Our Deacons"
              subtitle="Meet the deacons who serve our church family in care, hospitality, and outreach."
              members={deacons}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Deacons
