import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

function MemberDashboard() {
  const stats = [
    { label: 'Saved sermons', value: '12' },
    { label: 'Event registrations', value: '3' },
    { label: 'Prayer requests', value: '5' },
    { label: 'Giving history', value: '8' },
  ]

  const upcomingEvents = [
    { title: 'Youth Revival Night', date: 'Sep 5, 2026', time: '6:00 PM' },
    { title: 'Bible Study Launch', date: 'Sep 15, 2026', time: '7:00 PM' },
  ]

  return (
    <DashboardLayout role="member" title="Your Cornerstone account">
      <section className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-section">
        <h2>Quick links</h2>
        <div className="quick-actions-grid">
          <Link to="/sermons" className="action-card"><span className="action-label">Sermons</span></Link>
          <Link to="/events" className="action-card"><span className="action-label">Events</span></Link>
          <Link to="/prayer" className="action-card"><span className="action-label">Prayer</span></Link>
          <Link to="/give" className="action-card"><span className="action-label">Give</span></Link>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Events you are registered for</h2>
        <div className="activity-list">
          {upcomingEvents.map((event) => (
            <div key={event.title} className="activity-item">
              <div className="activity-indicator activity-event" />
              <div className="activity-content">
                <div className="activity-action">{event.title}</div>
                <div className="activity-time">{event.date} at {event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default MemberDashboard
