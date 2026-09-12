import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

function GivingDetail() {
  const { id } = useParams()

  const [giving, setGiving] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGiving = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000'}/api/giving/${id}`
        )

        if (!response.ok) {
          throw new Error('Giving entry not found')
        }

        const data = await response.json()

        setGiving(data.giving || data)
      } catch (err) {
        setError(err.message || 'Unable to load giving details.')
      } finally {
        setLoading(false)
      }
    }

    fetchGiving()
  }, [id])

  if (loading) {
    return (
      <main className="giving-detail-page">
        <div className="giving-detail-container">
          <p>Loading giving information...</p>
        </div>
      </main>
    )
  }

  if (error || !giving) {
    return (
      <main className="giving-detail-page">
        <div className="giving-detail-container">
          <h1>Giving information unavailable</h1>
          <p>{error || 'This giving entry could not be found.'}</p>

          <Link to="/give" className="giving-back-link">
            ← Back to Giving
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="giving-detail-page">
      <div className="giving-detail-container">
        <Link to="/give" className="giving-back-link">
          ← Back to Giving
        </Link>

        <section className="giving-detail-card">
          {giving.poster && (
            <div className="giving-detail-image-wrapper">
              <img
                src={giving.poster}
                alt={giving.title || 'Giving campaign'}
                className="giving-detail-image"
              />
            </div>
          )}

          <div className="giving-detail-content">
            <p className="giving-detail-category">
              {giving.category || 'Giving'}
            </p>

            <h1>{giving.title || 'Giving Opportunity'}</h1>

            {giving.description && (
              <p className="giving-detail-description">
                {giving.description}
              </p>
            )}

            {giving.payment_method && (
              <div className="giving-detail-section">
                <h2>Payment Method</h2>
                <p>{giving.payment_method}</p>
              </div>
            )}

            {giving.payment_details && (
              <div className="giving-detail-section">
                <h2>Payment Details</h2>
                <p>{giving.payment_details}</p>
              </div>
            )}

            <div className="giving-detail-actions">
              <Link to="/give" className="giving-primary-button">
                Back to Giving
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default GivingDetail