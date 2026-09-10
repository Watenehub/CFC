import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import * as dashboardApi from '../../api/dashboard'
import * as settingsApi from '../../api/settings'

function MediaDashboard() {
  const { hasPermission } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState({ is_live: false, livestream_url: '' })
  const [liveSaving, setLiveSaving] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')

  useEffect(() => {
    dashboardApi.getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Failed to load stats'))

    if (hasPermission('manage_notifications')) {
      settingsApi.getSettings()
        .then((data) => setSettings({
          is_live: Boolean(data.is_live),
          livestream_url: data.livestream_url || '',
        }))
        .catch(() => {})
    }
  }, [])

  const cards = [
    { label: 'Sermons', value: stats?.sermons, permission: 'manage_sermons', path: '/admin/sermons/manage' },
    { label: 'Events', value: stats?.events, permission: 'manage_events', path: '/admin/events/manage' },
    { label: 'Gallery photos', value: stats?.gallery, permission: 'manage_gallery', path: '/admin/gallery' },
    { label: 'Announcements', value: stats?.notifications, permission: 'manage_notifications', path: '/admin/announcements' },
  ]

  const quickActions = [
    { label: 'Add sermon', path: '/admin/sermons/manage', permission: 'manage_sermons' },
    { label: 'Manage events', path: '/admin/events/manage', permission: 'manage_events' },
    { label: 'Gallery studio', path: '/admin/gallery', permission: 'manage_gallery' },
    { label: 'Announcements', path: '/admin/announcements', permission: 'manage_notifications' },
  ]

  const saveLivestream = async () => {
    setLiveSaving(true)
    setLiveMessage('')
    try {
      const response = await settingsApi.updateLivestream({
        is_live: settings.is_live,
        livestream_url: settings.livestream_url,
      })
      setSettings({
        is_live: Boolean(response.settings.is_live),
        livestream_url: response.settings.livestream_url || '',
      })
      setLiveMessage(settings.is_live ? 'Watch Live is now showing as live.' : 'Livestream marked as offline.')
    } catch (err) {
      setLiveMessage(err.message || 'Failed to update livestream')
    } finally {
      setLiveSaving(false)
    }
  }

  return (
    <DashboardLayout role="media" title="Media desk">
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

      {hasPermission('manage_notifications') && (
        <section className="dashboard-section live-control-panel">
          <h2>Watch Live control</h2>
          <p className="dashboard-panel-copy">Toggle the public Watch Live page when a service is streaming.</p>
          <div className="live-control-grid">
            <label className="live-toggle">
              <input
                type="checkbox"
                checked={Boolean(settings.is_live)}
                onChange={(event) => setSettings((prev) => ({ ...prev, is_live: event.target.checked }))}
              />
              <span>Currently live</span>
            </label>
            <input
              type="url"
              className="live-url-input"
              placeholder="YouTube embed URL"
              value={settings.livestream_url}
              onChange={(event) => setSettings((prev) => ({ ...prev, livestream_url: event.target.value }))}
            />
            <button type="button" className="btn btn-primary" onClick={saveLivestream} disabled={liveSaving}>
              {liveSaving ? 'Saving…' : 'Update livestream'}
            </button>
          </div>
          {liveMessage && <p className="success-state">{liveMessage}</p>}
        </section>
      )}

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
        <h2>Recent sermons</h2>
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
          {stats && !stats.recent_sermons?.length && <p className="empty-admin-state">No sermons yet. Add one from Sermons.</p>}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default MediaDashboard
