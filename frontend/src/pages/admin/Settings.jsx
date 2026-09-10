import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as settingsApi from '../../api/settings'

const emptySettings = {
  church_name: '',
  address: '',
  phone: '',
  email: '',
  service_times: '',
  livestream_url: '',
  map_url: '',
  office_hours: '',
  is_live: false,
  mission: '',
  vision: '',
  beliefs: '',
}

function Settings() {
  const [settings, setSettings] = useState(emptySettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setError('')
      const data = await settingsApi.getSettings()
      setSettings({ ...emptySettings, ...data })
    } catch (err) {
      setError(err.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const response = await settingsApi.updateSettings(settings)
      setSettings({ ...emptySettings, ...response.settings })
      setSuccess('Site settings saved.')
    } catch (err) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role="admin" title="Settings">
      <div className="admin-page">
        <h2>Church site settings</h2>
        <p>These details power Contact, About, Watch Live, and the public footer areas.</p>
        {error && <p className="error-state">{error}</p>}
        {success && <p className="success-state">{success}</p>}

        {loading ? <p>Loading settings...</p> : (
          <>
            <div className="admin-form-block">
              <h3>Website details</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Church name</label>
                  <input value={settings.church_name} onChange={(event) => setSettings({ ...settings, church_name: event.target.value })} />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input value={settings.phone} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input type="email" value={settings.email} onChange={(event) => setSettings({ ...settings, email: event.target.value })} />
                </div>
                <div className="form-field">
                  <label>Office hours</label>
                  <input value={settings.office_hours} onChange={(event) => setSettings({ ...settings, office_hours: event.target.value })} />
                </div>
                <div className="form-field full-width">
                  <label>Address</label>
                  <input value={settings.address} onChange={(event) => setSettings({ ...settings, address: event.target.value })} />
                </div>
                <div className="form-field full-width">
                  <label>Service times summary</label>
                  <textarea rows="3" value={settings.service_times} onChange={(event) => setSettings({ ...settings, service_times: event.target.value })} />
                </div>
                <div className="form-field full-width">
                  <label>Map link</label>
                  <input value={settings.map_url} onChange={(event) => setSettings({ ...settings, map_url: event.target.value })} />
                </div>
              </div>
            </div>

            <div className="admin-form-block">
              <h3>Mission, vision & beliefs</h3>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Mission</label>
                  <textarea rows="3" value={settings.mission} onChange={(event) => setSettings({ ...settings, mission: event.target.value })} />
                </div>
                <div className="form-field full-width">
                  <label>Vision</label>
                  <textarea rows="3" value={settings.vision} onChange={(event) => setSettings({ ...settings, vision: event.target.value })} />
                </div>
                <div className="form-field full-width">
                  <label>What we believe</label>
                  <textarea rows="4" value={settings.beliefs} onChange={(event) => setSettings({ ...settings, beliefs: event.target.value })} />
                </div>
              </div>
            </div>

            <div className="admin-form-block">
              <h3>Livestream</h3>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Livestream / YouTube embed URL</label>
                  <input value={settings.livestream_url} onChange={(event) => setSettings({ ...settings, livestream_url: event.target.value })} />
                </div>
                <div className="form-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.is_live)}
                      onChange={(event) => setSettings({ ...settings, is_live: event.target.checked })}
                    />{' '}
                    Currently live on Watch Live page
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Update site settings'}
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Settings
