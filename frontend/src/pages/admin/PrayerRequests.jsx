import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as prayerApi from '../../api/prayer'

function PrayerRequests() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('New')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setError('')
      const data = await prayerApi.getPrayerRequests()
      setItems(data)
    } catch (err) {
      setError(err.message || 'Failed to load prayer requests')
    } finally {
      setLoading(false)
    }
  }

  const selected = items.find((item) => item.id === selectedId) || null

  const openItem = (item) => {
    setSelectedId(item.id)
    setStatus(item.status || 'New')
    setNotes(item.notes || '')
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    if (!selectedId) return
    setSaving(true)
    try {
      await prayerApi.updatePrayerRequest(selectedId, { status, notes })
      await fetchItems()
    } catch (err) {
      setError(err.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await prayerApi.deletePrayerRequest(id)
      if (selectedId === id) setSelectedId(null)
      await fetchItems()
    } catch (err) {
      setError(err.message || 'Failed to delete')
    }
  }

  return (
    <DashboardLayout role="admin" title="Prayer requests">
      <div className="admin-page">
        <h2>Prayer requests</h2>
        <p>Requests submitted from the public prayer page appear here for pastoral follow-up.</p>
        {error && <p className="error-state">{error}</p>}

        {loading ? <p>Loading...</p> : (
          <div className="admin-list">
            {items.map((item) => (
              <div key={item.id} className="admin-item-card">
                <div>
                  <strong>{item.category}</strong>
                  <div>{item.name}{item.privacy === 'private' ? ' · Private' : ''}</div>
                  <div className="meta-badge">{item.status}</div>
                </div>
                <div className="item-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => openItem(item)}>Open</button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            {!items.length && <p className="empty-admin-state">No prayer requests yet.</p>}
          </div>
        )}

        {selected && (
          <div className="admin-form-block" style={{ marginTop: '1.5rem' }}>
            <h3>{selected.category}</h3>
            <p><strong>From:</strong> {selected.name}{selected.email ? ` (${selected.email})` : ''}</p>
            {selected.phone && <p><strong>Phone:</strong> {selected.phone}</p>}
            <p>{selected.request}</p>
            <form className="admin-form" onSubmit={handleUpdate}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="New">New</option>
                    <option value="Praying">Praying</option>
                    <option value="Followed up">Followed up</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="form-field full-width">
                  <label>Pastoral notes</label>
                  <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedId(null)}>Close</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PrayerRequests
