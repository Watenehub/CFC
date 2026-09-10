import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as dashboardApi from '../../api/dashboard'

function AdminDashboard() {
  const { hasPermission } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardApi.getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Failed to load stats'))
  }, [])

  const cards = [
    { label: 'Users', value: stats?.users, permission: 'manage_users', path: '/admin/users' },
    { label: 'Events', value: stats?.events, permission: 'manage_events', path: '/admin/events/manage' },
    { label: 'Sermons', value: stats?.sermons, permission: 'manage_sermons', path: '/admin/sermons/manage' },
    { label: 'Open enquiries', value: stats?.open_enquiries, permission: 'manage_enquiries', path: '/admin/enquiries' },
    { label: 'Prayer requests', value: stats?.new_prayer_requests, permission: 'manage_enquiries', path: '/admin/prayer' },
    { label: 'Giving options', value: stats?.giving, permission: 'manage_giving', path: '/admin/giving' },
    { label: 'Gallery photos', value: stats?.gallery, permission: 'manage_gallery', path: '/admin/gallery' },
    { label: 'Announcements', value: stats?.notifications, permission: 'manage_notifications', path: '/admin/announcements' },
  ]

  const quickActions = [
    { label: 'Manage users', path: '/admin/users', permission: 'manage_users' },
    { label: 'Add event', path: '/admin/events/manage', permission: 'manage_events' },
    { label: 'Add sermon', path: '/admin/sermons/manage', permission: 'manage_sermons' },
    { label: 'View enquiries', path: '/admin/enquiries', permission: 'manage_enquiries' },
    { label: 'Prayer inbox', path: '/admin/prayer', permission: 'manage_enquiries' },
    { label: 'Giving', path: '/admin/giving', permission: 'manage_giving' },
    { label: 'Announcements', path: '/admin/announcements', permission: 'manage_notifications' },
    { label: 'Service times', path: '/admin/services', permission: 'manage_services' },
    { label: 'Ministries', path: '/admin/ministries', permission: 'manage_ministries' },
    { label: 'Pastors', path: '/admin/pastors', permission: 'manage_pastors' },
    { label: 'Deacons', path: '/admin/deacons', permission: 'manage_deacons' },
    { label: 'Gallery', path: '/admin/gallery', permission: 'manage_gallery' },
    { label: 'Settings', path: '/admin/settings', permission: 'manage_users' },
  ]

  return (
    <DashboardLayout role="admin" title="Church administration">
      {error && <p className="error-state">{error}</p>}

      <section className="stats-grid">
        {cards.filter((card) => hasPermission(card.permission)).map((card) => (
          <Link key={card.label} to={card.path} className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stats ? (card.value ?? 0) : '—'}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </Link>
        ))}
      </section>

      <section className="dashboard-section">
        <h2>Shortcuts</h2>
        <div className="quick-actions-grid">
          {quickActions.filter((action) => hasPermission(action.permission)).map((action) => (
            <Link key={action.path} to={action.path} className="action-card">
              <div className="action-label">{action.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent enquiries</h2>
        <div className="activity-list">
          {(stats?.recent_enquiries || []).map((item) => (
            <Link key={item.id} to="/admin/enquiries" className="activity-item">
              <div className="activity-indicator" />
              <div className="activity-content">
                <div className="activity-action">{item.subject} — {item.name}</div>
                <div className="activity-time">{item.status}</div>
              </div>
            </Link>
          ))}
          {stats && !stats.recent_enquiries?.length && <p className="empty-admin-state">No enquiries yet.</p>}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Latest sermons</h2>
        <div className="activity-list">
          {(stats?.recent_sermons || []).map((item) => (
            <Link key={item.id} to="/admin/sermons/manage" className="activity-item">
              <div className="activity-indicator" />
              <div className="activity-content">
                <div className="activity-action">{item.title}</div>
                <div className="activity-time">{item.speaker} · {item.date}</div>
              </div>
            </Link>
          ))}
          {stats && !stats.recent_sermons?.length && <p className="empty-admin-state">No sermons yet.</p>}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Upcoming events</h2>
        <div className="activity-list">
          {(stats?.upcoming_events || []).map((item) => (
            <Link key={item.id} to="/admin/events/manage" className="activity-item">
              <div className="activity-indicator" />
              <div className="activity-content">
                <div className="activity-action">{item.title}</div>
                <div className="activity-time">{item.date} · {item.location}</div>
              </div>
            </Link>
          ))}
          {stats && !stats.upcoming_events?.length && <p className="empty-admin-state">No upcoming events yet.</p>}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default AdminDashboard
