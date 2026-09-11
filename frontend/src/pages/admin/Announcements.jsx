import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as notificationsApi from '../../api/notifications'
import * as uploadsApi from '../../api/uploads'

const empty = { title: '', message: '', link: '', image: '', active: true, priority: 'normal' }

function Announcements() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setError('')
      setItems(await notificationsApi.getNotifications())
    } catch (err) {
      setError(err.message || 'Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await notificationsApi.updateNotification(editingId, formData)
      } else {
        await notificationsApi.createNotification(formData)
      }
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
      await notificationsApi.deleteNotification(id)
      await fetchItems()
    } catch (err) {
      setError(err.message || 'Failed to delete')
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const result = await uploadsApi.uploadFile(file)
      setFormData({ ...formData, image: result.url })
    } catch (err) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <DashboardLayout role="admin" title="Announcements">
      <div className="admin-page">
        <h2>Site announcements</h2>
        <p>Publish short notices that appear on the home page banner.</p>
        {error && <p className="error-state">{error}</p>}

        <div className="page-action-bar">
          <span>Keep the congregation informed.</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData(empty); setEditingId(null); setIsEditorOpen(true) }}>Add announcement</button>
        </div>

        {isEditorOpen && (
          <div className="editor-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setIsEditorOpen(false)}>
            <div className="editor-modal" role="dialog" aria-modal="true">
              <div className="editor-modal-header">
                <h3>{editingId ? 'Edit announcement' : 'Add announcement'}</h3>
                <button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button>
              </div>
              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>Title</label>
                    <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div className="form-field full-width">
                    <label>Message</label>
                    <textarea rows="3" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                  </div>
                  <div className="form-field full-width">
                    <label>Image (optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <small>Uploading...</small>}
                    {formData.image && (
                      <div>
                        <img src={formData.image} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                        <button type="button" className="btn btn-secondary" onClick={() => setFormData({ ...formData, image: '' })} style={{ marginLeft: '10px' }}>Remove</button>
                      </div>
                    )}
                    <small>Upload an image for the announcement. Images will appear in the Coming Up section.</small>
                  </div>
                  <div className="form-field">
                    <label>Optional link</label>
                    <input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="/events" />
                  </div>
                  <div className="form-field">
                    <label>Priority</label>
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>
                      <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} /> Active on website
                    </label>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Publish'}</button>
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
                  <strong>{item.title}</strong>
                  <div>{item.message}</div>
                  <div className="meta-badge">{item.active ? 'Active' : 'Hidden'} · {item.priority}</div>
                </div>
                <div className="item-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(item.id); setFormData({ title: item.title, message: item.message, link: item.link || '', image: item.image || '', active: !!item.active, priority: item.priority || 'normal' }); setIsEditorOpen(true) }}>Edit</button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            {!items.length && <p className="empty-admin-state">No announcements yet.</p>}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Announcements
