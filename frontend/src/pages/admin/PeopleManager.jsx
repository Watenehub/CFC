import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'
import { readSiteContent, writeSiteContent } from '../../data/siteContent'

const config = {
  ministries: {
    title: 'Ministries',
    permission: 'manage_ministries',
    fields: [['name', 'Name'], ['description', 'Description'], ['leader', 'Leader'], ['meeting_time', 'Meeting time'], ['location', 'Location'], ['contact', 'Contact']],
    empty: { name: '', description: '', leader: '', meeting_time: '', location: '', contact: '', image: '', encouragement: '' },
  },
  pastors: {
    title: 'Pastors',
    permission: 'manage_pastors',
    fields: [['name', 'Name'], ['title', 'Title'], ['bio', 'Biography']],
    empty: { name: '', title: '', bio: '', image: '', encouragement: '' },
  },
  deacons: {
    title: 'Deacons',
    permission: 'manage_deacons',
    fields: [['name', 'Name'], ['role', 'Role']],
    empty: { name: '', role: '', image: '', encouragement: '' },
  },
}

function PeopleManager({ type }) {
  const page = config[type]
  const [items, setItems] = useState(readSiteContent()[type] || [])
  const [formData, setFormData] = useState(page.empty)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const reset = () => {
    setFormData(page.empty)
    setEditingId(null)
    setIsEditorOpen(false)
  }

  const save = (nextItems) => {
    setItems(nextItems)
    writeSiteContent({ [type]: nextItems })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const item = { ...formData, id: editingId || Date.now() }
    save(editingId ? items.map((current) => current.id === editingId ? item : current) : [...items, item])
    reset()
  }

  const edit = (item) => {
    setEditingId(item.id)
    setFormData({ ...page.empty, ...item })
    setIsEditorOpen(true)
  }

  return (
    <DashboardLayout role="admin" title={`Manage ${page.title}`}>
      <div className="admin-page">
        <h2>Manage {page.title.toLowerCase()}</h2>
        <p>Add, edit, or remove entries. Updates are reflected on the public page after saving.</p>
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
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} {page.title.slice(0, -1).toLowerCase()}</button>
            {editingId && <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>}
          </div>
        </form>
        </div>
        </div>}
        <div className="admin-list-wrapper">
          <h3>Saved {page.title.toLowerCase()}</h3>
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
                  <button type="button" className="btn btn-danger" onClick={() => save(items.filter((current) => current.id !== item.id))}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PeopleManager
