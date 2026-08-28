import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function MemberDashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Saved Sermons', value: '12', icon: '📺', color: 'purple' },
    { label: 'Event Registrations', value: '3', icon: '📅', color: 'green' },
    { label: 'Prayer Requests', value: '5', icon: '🙏', color: 'pink' },
    { label: 'Giving History', value: '8', icon: '💰', color: 'teal' }
  ]

  const quickActions = [
    { label: 'View Profile', path: '/member/profile', icon: '👤' },
    { label: 'Browse Sermons', path: '/sermons', icon: '📺' },
    { label: 'Register for Events', path: '/events', icon: '📅' },
    { label: 'Submit Prayer Request', path: '/prayer', icon: '🙏' },
    { label: 'Give Online', path: '/give', icon: '💰' },
    { label: 'Account Settings', path: '/member/settings', icon: '⚙️' }
  ]

  const upcomingEvents = [
    { title: 'Youth Revival Night', date: 'Sep 5, 2026', time: '6:00 PM' },
    { title: 'Bible Study Launch', date: 'Sep 15, 2026', time: '7:00 PM' }
  ]

  return (
    <div className="member-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Member Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
        </div>

        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path} className="action-card">
                <div className="action-icon">{action.icon}</div>
                <div className="action-label">{action.label}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Your Registered Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <p>You haven't registered for any upcoming events.</p>
              <Link to="/events" className="btn btn-primary">
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-icon">📅</div>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">{event.date} at {event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Member Resources</h2>
          <div className="management-grid">
            <Link to="/member/profile" className="management-card">
              <div className="management-icon">👤</div>
              <h3>My Profile</h3>
              <p>View and update your profile information</p>
            </Link>
            <Link to="/member/sermons" className="management-card">
              <div className="management-icon">📺</div>
              <h3>Saved Sermons</h3>
              <p>View your saved sermon collection</p>
            </Link>
            <Link to="/member/events" className="management-card">
              <div className="management-icon">📅</div>
              <h3>My Events</h3>
              <p>View your event registrations</p>
            </Link>
            <Link to="/member/prayer" className="management-card">
              <div className="management-icon">🙏</div>
              <h3>Prayer Requests</h3>
              <p>View your prayer request history</p>
            </Link>
            <Link to="/member/giving" className="management-card">
              <div className="management-icon">💰</div>
              <h3>Giving History</h3>
              <p>View your giving records</p>
            </Link>
            <Link to="/member/settings" className="management-card">
              <div className="management-icon">⚙️</div>
              <h3>Account Settings</h3>
              <p>Manage your account preferences</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MemberDashboard
