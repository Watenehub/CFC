import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

function SecretaryDashboard() {
  const { hasPermission } = useAuth()

  const stats = [
    { label: 'Open enquiries', value: '23', permission: 'manage_enquiries' },
    { label: 'Awaiting a reply', value: '8', permission: 'manage_enquiries' },
    { label: 'Giving records', value: '89', permission: 'manage_giving' },
    { label: 'This month', value: 'KES 245K', permission: 'manage_giving' },
  ]

  const quickActions = [
    { label: 'View enquiries', path: '/secretary/enquiries', permission: 'manage_enquiries' },
    { label: 'Manage giving', path: '/secretary/giving', permission: 'manage_giving' },
  ]

  const recentActivity = [
    { action: 'New enquiry from a visitor', time: '1 hour ago' },
    { action: 'Replied to an enquiry', time: '3 hours ago' },
    { action: 'Giving record received', time: '5 hours ago' },
  ]

  return (
    <DashboardLayout role="secretary" title="Church office">
      <section className="stats-grid">
        {stats.filter(stat => hasPermission(stat.permission)).map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-section">
        <h2>Shortcuts</h2>
        <div className="quick-actions-grid">
          {quickActions.filter(action => hasPermission(action.permission)).map((action) => (
            <Link key={action.path} to={action.path} className="action-card">
              <div className="action-label">{action.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.action} className="activity-item">
              <div className="activity-indicator" />
              <div className="activity-content">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default SecretaryDashboard
