import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as servicesApi from '../../api/services'

const empty = { name: '', day: 'Sunday', time: '', location: '', description: '' }
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function Services() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setError('')
      setItems(await servicesApi.getServices())
    } catch (err) {
      setError(err.message || 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editingId) await servicesApi.updateService(editingId, formData)
      else await servicesApi.createService(formData)
      await fetchItems()
      setFormData(empty)
      setEditingId(null)
      setIsEditorOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await servicesApi.deleteService(id)
      await fetchItems()
    } catch (err) {
      setError(err.message || 'Failed to delete')
    }
  }

  return (
    <DashboardLayout role="admin" title="Service schedule">
      <div className="admin-page">
        <h2>Weekly services</h2>
        <p>These times appear on the About and Contact pages for visitors planning a visit.</p>
        {error && <p className="error-state">{error}</p>}

        <div className="page-action-bar">
          <span>Keep the weekly schedule accurate.</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData(empty); setEditingId(null); setIsEditorOpen(true) }}>Add service</button>
        </div>

        {isEditorOpen && (
          <div className="editor-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setIsEditorOpen(false)}>
            <div className="editor-modal" role="dialog" aria-modal="true">
              <div className="editor-modal-header">
                <h3>{editingId ? 'Edit service' : 'Add service'}</h3>
                <button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button>
              </div>
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Name</label>
                    <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="form-field">
                    <label>Day</label>
                    <select value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })}>
                      {days.map((day) => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Time</label>
                    <input value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="9:00 AM" required />
                  </div>
                  <div className="form-field">
                    <label>Location</label>
                    <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                  <div className="form-field full-width">
                    <label>Description</label>
                    <textarea rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add service'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? <p>Loading...</p> : (
          <div className="admin-list">
            {items.map((item) => (
              <div key={item.id} className="admin-item-card">
                <div>
                  <strong>{item.name}</strong>
                  <div>{item.day} · {item.time}{item.location ? ` · ${item.location}` : ''}</div>
                </div>
                <div className="item-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(item.id); setFormData({ name: item.name, day: item.day, time: item.time, location: item.location || '', description: item.description || '' }); setIsEditorOpen(true) }}>Edit</button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            {!items.length && <p className="empty-admin-state">No services scheduled yet.</p>}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Services
