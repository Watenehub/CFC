import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as sermonsApi from '../api/sermons'
import PageHero from '../components/PageHero'
import './Sermons.css'

function Sermons() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpeaker, setSelectedSpeaker] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    loadSermons()
  }, [])

  const loadSermons = async () => {
    try {
      const data = await sermonsApi.getSermons()
      setSermons(data)
    } catch (err) {
      setError('Failed to load sermons')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredSermons = sermons.filter(sermon => {
    const title = (sermon.title || '').toLowerCase()
    const speaker = (sermon.speaker || '').toLowerCase()
    const scripture = (sermon.scripture || '').toLowerCase()
    const term = searchTerm.toLowerCase()

    const matchesSearch = searchTerm === '' ||
      title.includes(term) ||
      speaker.includes(term) ||
      scripture.includes(term)

    const matchesSpeaker = selectedSpeaker === '' || sermon.speaker === selectedSpeaker
    const matchesCategory = selectedCategory === '' || sermon.category === selectedCategory

    return matchesSearch && matchesSpeaker && matchesCategory
  })

  const speakers = [...new Set(sermons.map(s => s.speaker))]
  const categories = [...new Set(sermons.map(s => s.category))]

  if (loading) {
    return (
      <div className="sermons-page">
        <PageHero eyebrow="Teaching" title="Sermons" subtitle="Messages from Cornerstone Family Chapel to encourage you in the Word." />
        <div className="page-body"><div className="container"><div className="loading-state">Loading sermons...</div></div></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sermons-page">
        <PageHero eyebrow="Teaching" title="Sermons" subtitle="Messages from Cornerstone Family Chapel to encourage you in the Word." />
        <div className="page-body"><div className="container"><div className="error-state">{error}</div></div></div>
      </div>
    )
  }

  return (
    <div className="sermons-page">
      <PageHero
        eyebrow="Teaching"
        title="Sermons"
        subtitle="Browse recent messages from our pulpit. Search by title, speaker, or Scripture."
        image="/images/cornerstone/page_01/page01_photo002_worship_service_participants.jpg"
      />
      <div className="page-body page-body--white">
      <div className="container">

        <section className="sermons-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search sermons by title, speaker, or scripture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-dropdowns">
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="filter-select"
            >
              <option value="">All Speakers</option>
              {speakers.map(speaker => (
                <option key={speaker} value={speaker}>{speaker}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </section>

        {filteredSermons.length === 0 ? (
          <div className="empty-state">
            <p>No sermons found matching your criteria.</p>
          </div>
        ) : (
          <div className="sermons-grid">
            {filteredSermons.map((sermon) => (
              <Link key={sermon.id} to={`/sermons/${sermon.id}`} className="sermon-card">
                <div className="sermon-thumbnail">
                  <img src={sermon.thumbnail || '/CFC_CHURCH_PHOTO.jpg'} alt={sermon.title} loading="lazy" />
                  {sermon.video_url && <span className="sermon-play-badge" aria-hidden="true">▶</span>}
                </div>
                <div className="sermon-content">
                  {sermon.category && <div className="sermon-category">{sermon.category}</div>}
                  <h3>{sermon.title}</h3>
                  <p className="sermon-speaker">{sermon.speaker}</p>
                  {sermon.date && (
                    <p className="sermon-date">{new Date(sermon.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  )}
                  {sermon.scripture && <p className="sermon-scripture">{sermon.scripture}</p>}
                  <p className="sermon-description">{sermon.description}</p>
                  <span className="btn btn-primary">Watch Sermon</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default Sermons
