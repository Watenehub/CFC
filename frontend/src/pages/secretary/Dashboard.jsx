import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function SecretaryDashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Enquiries', value: '23', icon: '💬', color: 'orange' },
    { label: 'Pending Responses', value: '8', icon: '⏳', color: 'blue' },
    { label: 'Giving Records', value: '89', icon: '💰', color: 'green' },
    { label: 'Giving Campaigns', value: '6', icon: '📊', color: 'purple' },
    { label: 'This Month', value: 'KES 245K', icon: '📈', color: 'teal' },
    { label: 'Total Giving', value: 'KES 1.2M', icon: '💵', color: 'pink' }
  ]

  const quickActions = [
    { label: 'View Enquiries', path: '/secretary/enquiries', icon: '💬' },
    { label: 'Respond to Enquiry', path: '/secretary/enquiries/respond', icon: '✉️' },
    { label: 'Add Giving Campaign', path: '/secretary/giving/create', icon: '➕' },
    { label: 'View Giving Records', path: '/secretary/giving/records', icon: '💰' },
    { label: 'Update Campaign', path: '/secretary/giving/update', icon: '✏️' },
    { label: 'Generate Report', path: '/secretary/reports', icon: '📊' }
  ]

  const recentActivity = [
    { action: 'New enquiry from visitor', time: '1 hour ago', type: 'enquiry' },
    { action: 'Responded to enquiry', time: '3 hours ago', type: 'response' },
    { action: 'Giving donation received', time: '5 hours ago', type: 'giving' },
    { action: 'Campaign poster updated', time: '1 day ago', type: 'campaign' },
    { action: 'Enquiry status updated', time: '2 days ago', type: 'enquiry' }
  ]

  return (
    <div className="secretary-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Secretary Dashboard</h1>
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
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-indicator activity-${activity.type}`}></div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Secretary Management</h2>
          <div className="management-grid">
            <Link to="/secretary/enquiries" className="management-card">
              <div className="management-icon">💬</div>
              <h3>Enquiries</h3>
              <p>View and respond to contact enquiries</p>
            </Link>
            <Link to="/secretary/giving" className="management-card">
              <div className="management-icon">💰</div>
              <h3>Giving Management</h3>
              <p>Manage giving campaigns and records</p>
            </Link>
            <Link to="/secretary/campaigns" className="management-card">
              <div className="management-icon">📊</div>
              <h3>Campaigns</h3>
              <p>Create and manage giving campaigns</p>
            </Link>
            <Link to="/secretary/posters" className="management-card">
              <div className="management-icon">🖼️</div>
              <h3>Campaign Posters</h3>
              <p>Upload and manage campaign posters</p>
            </Link>
            <Link to="/secretary/records" className="management-card">
              <div className="management-icon">📋</div>
              <h3>Giving Records</h3>
              <p>View and manage giving records</p>
            </Link>
            <Link to="/secretary/reports" className="management-card">
              <div className="management-icon">📊</div>
              <h3>Reports</h3>
              <p>Generate financial reports</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SecretaryDashboard
