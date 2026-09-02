import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as sermonsApi from '../api/sermons'
import { readSiteContent } from '../data/siteContent'
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

    const handleContentUpdate = () => loadSermons()
    window.addEventListener('cornerstone-content-updated', handleContentUpdate)

    return () => window.removeEventListener('cornerstone-content-updated', handleContentUpdate)
  }, [])

  const loadSermons = async () => {
    try {
      const localContent = readSiteContent()
      if (localContent.sermons?.length) {
        setSermons(localContent.sermons)
        return
      }

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
    const matchesSearch = searchTerm === '' || 
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase())
    
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

  const sermonsList = sermons.length > 0 ? sermons : [
    {
      id: 1,
      title: 'Walking in Faith: Trusting God\'s Plan',
      description: 'Discover how to trust God completely and walk in faith, even when the path is unclear.',
      speaker: 'Nahashon Wachira',
      date: '2026-08-25',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: 'Proverbs 3:5-6',
      category: 'Faith',
      tags: ['faith', 'trust', 'proverbs']
    },
    {
      id: 2,
      title: 'The Power of Prayer',
      description: 'Learn how prayer can transform your life and deepen your relationship with God.',
      speaker: 'Nahashon Wachira',
      date: '2026-08-18',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: 'Philippians 4:6-7',
      category: 'Prayer',
      tags: ['prayer', 'philippians', 'peace']
    },
    {
      id: 3,
      title: 'Living with Purpose',
      description: 'Discover God\'s purpose for your life and how to walk it out daily.',
      speaker: 'Nahashon Wachira',
      date: '2026-08-11',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: 'Jeremiah 29:11',
      category: 'Purpose',
      tags: ['purpose', 'jeremiah', 'calling']
    },
    {
      id: 4,
      title: 'Building Strong Families',
      description: 'Biblical principles for building and maintaining strong, godly families.',
      speaker: 'Nahashon Wachira',
      date: '2026-08-04',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: 'Joshua 24:15',
      category: 'Family',
      tags: ['family', 'joshua', 'marriage']
    },
    {
      id: 5,
      title: 'The Beatitudes: Blessed are the Poor in Spirit',
      description: 'Understanding the first beatitude and what it means to be poor in spirit.',
      speaker: 'Nahashon Wachira',
      date: '2026-07-28',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: 'Matthew 5:3',
      category: 'Sermon on the Mount',
      tags: ['beatitudes', 'matthew', 'humility']
    },
    {
      id: 6,
      title: 'Overcoming Anxiety',
      description: 'Find peace and overcome anxiety through faith in God\'s promises.',
      speaker: 'Nahashon Wachira',
      date: '2026-07-21',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: '1 Peter 5:7',
      category: 'Mental Health',
      tags: ['anxiety', 'peace', '1-peter']
    }
  ]

  const displaySermons = sermons.length > 0 ? filteredSermons : sermonsList.filter(s => {
    const matchesSearch = searchTerm === '' || 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scripture.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpeaker = selectedSpeaker === '' || s.speaker === selectedSpeaker
    const matchesCategory = selectedCategory === '' || s.category === selectedCategory

    return matchesSearch && matchesSpeaker && matchesCategory
  })

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
              {[...new Set(sermonsList.map(s => s.speaker))].map(speaker => (
                <option key={speaker} value={speaker}>{speaker}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {[...new Set(sermonsList.map(s => s.category))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </section>

        {displaySermons.length === 0 ? (
          <div className="empty-state">
            <p>No sermons found matching your criteria.</p>
          </div>
        ) : (
          <div className="sermons-grid">
            {displaySermons.map((sermon) => (
              <div key={sermon.id} className="sermon-card">
                <div className="sermon-thumbnail">
                  <img src={sermon.thumbnail || '/CFC_CHURCH_PHOTO.jpg'} alt={sermon.title} />
                </div>
                <div className="sermon-content">
                  <div className="sermon-category">{sermon.category}</div>
                  <h3>{sermon.title}</h3>
                  <p className="sermon-speaker">{sermon.speaker}</p>
                  <p className="sermon-date">{new Date(sermon.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p className="sermon-scripture">{sermon.scripture}</p>
                  <p className="sermon-description">{sermon.description}</p>
                  <Link to={`/sermons/${sermon.id}`} className="btn btn-primary">
                    Watch Sermon
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default Sermons
