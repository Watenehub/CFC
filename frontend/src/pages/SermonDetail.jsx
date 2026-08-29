import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as sermonsApi from '../api/sermons'
import './SermonDetail.css'

function SermonDetail() {
  const { id } = useParams()
  const [sermon, setSermon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSermon()
  }, [id])

  const loadSermon = async () => {
    try {
      const data = await sermonsApi.getSermon(id)
      setSermon(data)
    } catch (err) {
      setError('Failed to load sermon')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  if (loading) {
    return (
      <div className="sermon-detail-page">
        <div className="container">
          <div className="loading-state">Loading sermon...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sermon-detail-page">
        <div className="container">
          <div className="error-state">{error}</div>
        </div>
      </div>
    )
  }

  const sermonData = sermon || {
    id: 1,
    title: 'Walking in Faith: Trusting God\'s Plan',
    description: 'Discover how to trust God completely and walk in faith, even when the path is unclear. In this message, we explore the wisdom of Proverbs 3:5-6 and learn practical ways to lean not on our own understanding but to acknowledge God in all our ways.',
    speaker: 'Nahashon Wachira',
    date: '2026-08-25',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    audio_url: '',
    thumbnail: '/CFC_CHURCH_PHOTO.jpg',
    scripture: 'Proverbs 3:5-6',
    category: 'Faith',
    tags: ['faith', 'trust', 'proverbs']
  }

  const embedUrl = getYouTubeEmbedUrl(sermonData.video_url)

  return (
    <div className="sermon-detail-page">
      <div className="container">
        <Link to="/sermons" className="back-link">
          ← Back to Sermons
        </Link>

        <div className="sermon-detail-content">
          <div className="sermon-detail-header">
            <div className="sermon-detail-category">{sermonData.category}</div>
            <h1>{sermonData.title}</h1>
            <div className="sermon-detail-meta">
              <span className="meta-item">
                <strong>Speaker:</strong> {sermonData.speaker}
              </span>
              <span className="meta-item">
                <strong>Date:</strong> {new Date(sermonData.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="meta-item">
                <strong>Scripture:</strong> {sermonData.scripture}
              </span>
            </div>
          </div>

          {embedUrl && (
            <div className="sermon-video">
              <iframe
                width="100%"
                height="500"
                src={embedUrl}
                title={sermonData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {sermonData.audio_url && (
            <div className="sermon-audio">
              <h3>Audio</h3>
              <audio controls>
                <source src={sermonData.audio_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="sermon-detail-description">
            <h2>About This Sermon</h2>
            <p>{sermonData.description}</p>
          </div>

          {sermonData.tags && sermonData.tags.length > 0 && (
            <div className="sermon-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {sermonData.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SermonDetail
