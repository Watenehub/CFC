import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as dashboardApi from '../../api/dashboard'

function SecretaryDashboard() {
  const { hasPermission } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardApi.getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Failed to load stats'))
  }, [])

  const cards = [
    { label: 'Open enquiries', value: stats?.open_enquiries, permission: 'manage_enquiries', path: '/admin/enquiries' },
    { label: 'All enquiries', value: stats?.enquiries, permission: 'manage_enquiries', path: '/admin/enquiries' },
    { label: 'New prayer requests', value: stats?.new_prayer_requests, permission: 'manage_enquiries', path: '/admin/prayer' },
    { label: 'Giving options', value: stats?.giving, permission: 'manage_giving', path: '/admin/giving' },
    { label: 'Weekly services', value: stats?.services, permission: 'manage_services', path: '/admin/services' },
  ]

  const quickActions = [
    { label: 'View enquiries', path: '/admin/enquiries', permission: 'manage_enquiries' },
    { label: 'Prayer inbox', path: '/admin/prayer', permission: 'manage_enquiries' },
    { label: 'Manage giving', path: '/admin/giving', permission: 'manage_giving' },
    { label: 'Service times', path: '/admin/services', permission: 'manage_services' },
  ]

  return (
    <DashboardLayout role="secretary" title="Church office">
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
    </DashboardLayout>
  )
}

export default SecretaryDashboard
