import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'
import * as sermonsApi from '../../api/sermons'

const emptySermon = {
  title: '',
  description: '',
  speaker: '',
  date: '',
  video_url: '',
  thumbnail: '',
  scripture: '',
  category: '',
  key_takeaways: '',
}

function SermonsCreate() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(emptySermon)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSermons()
  }, [])

  const fetchSermons = async () => {
    try {
      setError('')
      const data = await sermonsApi.getSermons()
      setSermons(data)
    } catch (err) {
      setError(err.message || 'Failed to load sermons')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingId) {
        await sermonsApi.updateSermon(editingId, formData)
      } else {
        await sermonsApi.createSermon(formData)
      }
      await fetchSermons()
      setFormData(emptySermon)
      setEditingId(null)
      setIsEditorOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to save sermon')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (sermon) => {
    setEditingId(sermon.id)
    setFormData({ ...emptySermon, ...sermon, key_takeaways: sermon.key_takeaways || '' })
    setIsEditorOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await sermonsApi.deleteSermon(id)
      await fetchSermons()
      if (editingId === id) {
        setEditingId(null)
        setFormData(emptySermon)
        setIsEditorOpen(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to delete sermon')
    }
  }

  return (
    <DashboardLayout role="admin" title="Manage Sermons">
      <div className="admin-page">
        <h2>Manage sermons</h2>
        <p>Add sermon details, video links, Scripture themes, and teaching summaries for the website.</p>
        {error && <p className="error-state">{error}</p>}

        <div className="page-action-bar">
          <span>Publish a new message to the sermon library.</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData(emptySermon); setEditingId(null); setIsEditorOpen(true) }}>Add sermon</button>
        </div>

        {isEditorOpen && <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditorOpen(false)}>
        <div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="sermon-editor-title">
          <div className="editor-modal-header"><h3 id="sermon-editor-title">{editingId ? 'Edit sermon' : 'Add sermon'}</h3><button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button></div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Title</label>
              <input type="text" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} required />
            </div>
            <div className="form-field">
              <label>Speaker</label>
              <input type="text" value={formData.speaker} onChange={(event) => setFormData({ ...formData, speaker: event.target.value })} required />
            </div>
            <div className="form-field">
              <label>Theme verse</label>
              <input type="text" value={formData.scripture} onChange={(event) => setFormData({ ...formData, scripture: event.target.value })} />
            </div>
            <div className="form-field">
              <label>Category</label>
              <input type="text" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} required />
            </div>
            <div className="form-field">
              <label>Date</label>
              <input type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} required />
            </div>
            <div className="form-field">
              <label>YouTube link</label>
              <input type="url" value={formData.video_url} onChange={(event) => setFormData({ ...formData, video_url: event.target.value })} required />
            </div>
            <ImageUpload label="Thumbnail / sermon image" value={formData.thumbnail} onChange={(thumbnail) => setFormData({ ...formData, thumbnail })} />
            <div className="form-field full-width">
              <label>Description</label>
              <textarea rows="4" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} required />
            </div>
            <div className="form-field full-width">
              <label>Key takeaways</label>
              <textarea rows="3" value={formData.key_takeaways} onChange={(event) => setFormData({ ...formData, key_takeaways: event.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update sermon' : 'Add sermon'}</button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData(emptySermon) }}>Cancel</button>
            )}
          </div>
        </form>
        </div>
        </div>}

        <div className="admin-list-wrapper">
          <h3>Saved sermons</h3>
          {loading ? <p>Loading sermons...</p> : (
            <div className="admin-list">
              {sermons.map((item) => (
                <div key={item.id} className="admin-item-card">
                  <div>
                    <strong>{item.title}</strong>
                    <div>{item.speaker}</div>
                    <div className="meta-badge">{item.category}</div>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => handleEdit(item)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              {!sermons.length && <p className="empty-admin-state">No sermons yet. Add one to get started.</p>}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SermonsCreate
