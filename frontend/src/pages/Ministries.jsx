import { useState, useEffect } from 'react'
import * as ministriesApi from '../api/ministries'
import { readSiteContent } from '../data/siteContent'
import PageHero from '../components/PageHero'
import './Ministries.css'

function Ministries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMinistries()

    const handleContentUpdate = () => loadMinistries()
    window.addEventListener('cornerstone-content-updated', handleContentUpdate)

    return () => window.removeEventListener('cornerstone-content-updated', handleContentUpdate)
  }, [])

  const loadMinistries = async () => {
    try {
      const localContent = readSiteContent()
      if (localContent.ministries?.length) {
        setMinistries(localContent.ministries)
        return
      }

      const data = await ministriesApi.getMinistries()
      setMinistries(data)
    } catch (err) {
      setError('Failed to load ministries')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const ministriesList = ministries.length > 0 ? ministries : [
    {
      id: 1,
      name: 'Youth Ministry',
      description: 'Empowering the next generation to grow in faith and serve with purpose.',
      leader: 'Nahashon Wachira',
      meeting_time: 'Fridays 6:00 PM',
      location: 'Youth Center',
      contact: 'youth@cornerstonechapel.org',
      image: '/chapel.jpg'
    },
    {
      id: 2,
      name: 'Children & Teens Ministry',
      description: 'We desire to create an environment where children and young people can feel welcomed, connected, and encouraged to grow in their faith. Through Bible stories, interactive activities, fellowship, and service opportunities, the ministry seeks to nurture spiritual, social, and emotional growth while helping young people develop meaningful relationships within the church. The ministry also envisions a dedicated space where children can worship, learn, participate in activities, and grow together.',
      leader: '<em>To be updated</em>',
      meeting_time: '<em>To be updated</em>',
      location: '<em>To be updated</em>',
      contact: '<em>To be updated</em>',
      image: '/images/cornerstone/page_06/page06_photo026_children_ministry_group.jpg'
    },
    {
      id: 3,
      name: 'Men\'s Ministry',
      description: 'Building strong men of faith through fellowship, study, and service.',
      leader: 'James Brown',
      meeting_time: 'Saturdays 8:00 AM',
      location: 'Church Hall',
      contact: 'men@cornerstonechapel.org',
      image: '/chapel.jpg'
    },
    {
      id: 4,
      name: 'Women\'s Ministry',
      description: 'Empowering women to grow in faith and support one another in community.',
      leader: 'Mary Davis',
      meeting_time: 'Tuesdays 6:00 PM',
      location: 'Fellowship Hall',
      contact: 'women@cornerstonechapel.org',
      image: '/chapel.jpg'
    },
    {
      id: 5,
      name: 'Praise & Worship',
      description: 'Our Praise & Worship ministry serves with dedication, giving their time, talents, and hearts to help create meaningful worship experiences. Through music, preparation, rehearsal, and service, the team seeks to uplift the congregation and help us connect more deeply in worship. We are grateful for everyone who serves behind the scenes and contributes to creating an atmosphere of worship, unity, and fellowship.',
      leader: '<em>To be updated</em>',
      meeting_time: '<em>To be updated</em>',
      location: '<em>To be updated</em>',
      contact: '<em>To be updated</em>',
      image: '/images/cornerstone/page_07/page07_photo030_praise_and_worship_team_group.jpg'
    },
    {
      id: 6,
      name: 'Media Ministry',
      description: 'Spreading the gospel through digital platforms and media production.',
      leader: 'Peter Kimani',
      meeting_time: 'Sundays 8:00 AM',
      location: 'Media Room',
      contact: 'media@cornerstonechapel.org',
      image: '/images/cornerstone/page_08/page08_photo042_media_control_room.jpg'
    },
    {
      id: 7,
      name: 'Ushering & Hospitality',
      description: 'Creating a welcoming environment for all who visit our church.',
      leader: 'Grace Njoroge',
      meeting_time: 'Sundays 8:30 AM',
      location: 'Main Entrance',
      contact: 'hospitality@cornerstonechapel.org',
      image: '/chapel.jpg'
    },
    {
      id: 8,
      name: 'Security Ministry',
      description: 'Ensuring the safety and security of our congregation and facilities.',
      leader: 'Robert Ochieng',
      meeting_time: 'Sundays 8:00 AM',
      location: 'Security Office',
      contact: 'security@cornerstonechapel.org',
      image: '/chapel.jpg'
    },
    {
      id: 9,
      name: 'Community Outreach',
      description: 'Community outreach is an important part of who we are. We believe that faith is expressed not only through worship, but also through compassion, kindness, generosity, and practical service. From supporting people in need to participating in community initiatives, we seek opportunities to uplift others and build meaningful relationships. Our desire is to be a beacon of hope in our community and beyond. Medical camps have provided opportunities to serve members of the wider community through health services, wellness activities, encouragement, and meaningful conversations.',
      leader: '<em>To be updated</em>',
      meeting_time: '<em>To be updated</em>',
      location: '<em>To be updated</em>',
      contact: '<em>To be updated</em>',
      image: '/images/cornerstone/page_10/page10_photo064_community_outreach_group.jpg'
    }
  ]

  if (loading) {
    return (
      <div className="ministries-page">
        <PageHero eyebrow="Serve" title="Our Ministries" subtitle="Find your place to serve and grow" />
        <div className="page-body">
          <div className="container">
            <div className="loading-state">Loading ministries...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ministries-page">
        <PageHero eyebrow="Serve" title="Our Ministries" subtitle="Find your place to serve and grow" />
        <div className="page-body">
          <div className="container">
            <div className="error-state">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ministries-page">
      <PageHero
        eyebrow="Serve"
        title="Our Ministries"
        subtitle="Find your place to serve and grow"
      />
      <div className="page-body">
        <div className="container">
          <div className="ministries-grid">
            {ministriesList.map((ministry) => (
              <div key={ministry.id} className="ministry-feature-frame fade-up">
                <img src={ministry.image || '/chapel.jpg'} alt={ministry.name} className="ministry-feature-image" />
                <div className="ministry-feature-content">
                  <h3 className="ministry-feature-title">{ministry.name}</h3>
                  <p className="ministry-feature-description">{ministry.description}</p>
                  {ministry.encouragement && <p className="leader-encouragement">{ministry.encouragement}</p>}
                  <div className="ministry-details">
                    <div className="ministry-detail">
                      <span className="detail-label">Leader:</span>
                      <span className="detail-value">{ministry.leader}</span>
                    </div>
                    <div className="ministry-detail">
                      <span className="detail-label">Meeting Time:</span>
                      <span className="detail-value">{ministry.meeting_time}</span>
                    </div>
                    <div className="ministry-detail">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{ministry.location}</span>
                    </div>
                    <div className="ministry-detail">
                      <span className="detail-label">Contact:</span>
                      <span className="detail-value">{ministry.contact}</span>
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ministries
