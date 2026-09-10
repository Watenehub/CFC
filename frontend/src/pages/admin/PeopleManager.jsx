import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'
import * as ministriesApi from '../../api/ministries'
import * as pastorsApi from '../../api/pastors'
import * as deaconsApi from '../../api/deacons'

const config = {
  ministries: {
    title: 'Ministries',
    fields: [['name', 'Name'], ['description', 'Description'], ['leader', 'Leader'], ['meeting_time', 'Meeting time'], ['location', 'Location'], ['contact', 'Contact']],
    empty: { name: '', description: '', leader: '', meeting_time: '', location: '', contact: '', image: '', encouragement: '' },
    list: () => ministriesApi.getMinistries(),
    create: (data) => ministriesApi.createMinistry(data),
    update: (id, data) => ministriesApi.updateMinistry(id, data),
    remove: (id) => ministriesApi.deleteMinistry(id),
  },
  pastors: {
    title: 'Pastors',
    fields: [['name', 'Name'], ['title', 'Title'], ['bio', 'Biography']],
    empty: { name: '', title: '', bio: '', image: '', encouragement: '' },
    list: () => pastorsApi.getPastors(),
    create: (data) => pastorsApi.createPastor(data),
    update: (id, data) => pastorsApi.updatePastor(id, data),
    remove: (id) => pastorsApi.deletePastor(id),
  },
  deacons: {
    title: 'Deacons',
    fields: [['name', 'Name'], ['role', 'Role']],
    empty: { name: '', role: '', image: '', encouragement: '' },
    list: () => deaconsApi.getDeacons(),
    create: (data) => deaconsApi.createDeacon(data),
    update: (id, data) => deaconsApi.updateDeacon(id, data),
    remove: (id) => deaconsApi.deleteDeacon(id),
  },
}

function PeopleManager({ type }) {
  const page = config[type]
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(page.empty)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [type])

  const fetchItems = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await page.list()
      setItems(data)
    } catch (err) {
      setError(err.message || `Failed to load ${page.title.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFormData(page.empty)
    setEditingId(null)
    setIsEditorOpen(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingId) {
        await page.update(editingId, formData)
      } else {
        await page.create(formData)
      }
      await fetchItems()
      reset()
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const edit = (item) => {
    setEditingId(item.id)
    setFormData({ ...page.empty, ...item })
    setIsEditorOpen(true)
  }

  const remove = async (id) => {
    try {
      setError('')
      await page.remove(id)
      await fetchItems()
      if (editingId === id) reset()
    } catch (err) {
      setError(err.message || 'Failed to delete')
    }
  }

  return (
    <DashboardLayout role="admin" title={`Manage ${page.title}`}>
      <div className="admin-page">
        <h2>Manage {page.title.toLowerCase()}</h2>
        <p>Add, edit, or remove entries. Updates are reflected on the public page after saving.</p>
        {error && <p className="error-state">{error}</p>}
        <div className="page-action-bar">
          <span>Curate the people and ministries displayed publicly.</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData(page.empty); setEditingId(null); setIsEditorOpen(true) }}>Add {page.title.slice(0, -1).toLowerCase()}</button>
        </div>

        {isEditorOpen && <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditorOpen(false)}>
        <div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="people-editor-title">
          <div className="editor-modal-header"><h3 id="people-editor-title">{editingId ? 'Edit' : 'Add'} {page.title.slice(0, -1).toLowerCase()}</h3><button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button></div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {page.fields.map(([field, label]) => (
              <div key={field} className={`form-field${field === 'description' || field === 'bio' ? ' full-width' : ''}`}>
                <label>{label}</label>
                {field === 'description' || field === 'bio' ? (
                  <textarea rows="3" value={formData[field]} onChange={(event) => setFormData({ ...formData, [field]: event.target.value })} required={field === 'name'} />
                ) : (
                  <input value={formData[field]} onChange={(event) => setFormData({ ...formData, [field]: event.target.value })} required={field === 'name'} />
                )}
              </div>
            ))}
            <div className="form-field full-width">
              <label>Encouragement</label>
              <textarea rows="3" value={formData.encouragement} onChange={(event) => setFormData({ ...formData, encouragement: event.target.value })} placeholder="A short encouragement for the church family" />
            </div>
            <ImageUpload label="Photo" value={formData.image} onChange={(image) => setFormData({ ...formData, image })} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : `${editingId ? 'Update' : 'Add'} ${page.title.slice(0, -1).toLowerCase()}`}</button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
          </div>
        </form>
        </div>
        </div>}
        <div className="admin-list-wrapper">
          <h3>Saved {page.title.toLowerCase()}</h3>
          {loading ? <p>Loading...</p> : (
            <div className="admin-list">
              {items.map((item) => (
                <div key={item.id} className="admin-item-card">
                  <div>
                    <strong>{item.name}</strong>
                    <div>{item.title || item.role || item.leader}</div>
                    {item.encouragement && <div className="item-encouragement">{item.encouragement}</div>}
                  </div>
                  <div className="item-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => edit(item)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => remove(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              {!items.length && <p className="empty-admin-state">No entries yet. Add one to get started.</p>}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PeopleManager
