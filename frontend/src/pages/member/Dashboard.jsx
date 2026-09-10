import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

function MemberDashboard() {
  const { user } = useAuth()

  const quickLinks = [
    { label: 'Browse sermons', path: '/sermons', description: 'Watch recent messages' },
    { label: 'Upcoming events', path: '/events', description: 'See what is happening next' },
    { label: 'Request prayer', path: '/prayer', description: 'Share a request with the church' },
    { label: 'Give', path: '/give', description: 'Support the ministry' },
    { label: 'Contact office', path: '/contact', description: 'Send a message to the church' },
    { label: 'Watch live', path: '/watch-live', description: 'Join when we are broadcasting' },
  ]

  return (
    <DashboardLayout role="member" title="Welcome">
      <div className="admin-page">
        <h2>Hello{user?.name ? `, ${user.name}` : ''}</h2>
        <p>
          Use the shortcuts below to stay connected with Cornerstone Family Chapel.
          A full member portal (saved sermons, giving history, event registration) can be added later.
        </p>
      </div>

      <section className="dashboard-section">
        <h2>Quick links</h2>
        <div className="quick-actions-grid">
          {quickLinks.map((item) => (
            <Link key={item.path} to={item.path} className="action-card">
              <div className="action-label">{item.label}</div>
              <div className="activity-time">{item.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default MemberDashboard
