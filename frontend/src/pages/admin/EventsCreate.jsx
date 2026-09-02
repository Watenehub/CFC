import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'
import { readSiteContent, writeSiteContent } from '../../data/siteContent'

const emptyEvent = {
  id: '',
  title: '',
  description: '',
  date: '',
  start_time: '',
  end_time: '',
  location: '',
  map_url: '',
  image: '',
  organizer: '',
  registration_status: 'open',
  max_participants: '',
  registration_deadline: '',
}

function EventsCreate() {
  const [events, setEvents] = useState(readSiteContent().events)
  const [formData, setFormData] = useState(emptyEvent)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const saveEvents = (nextEvents) => {
    setEvents(nextEvents)
    writeSiteContent({ events: nextEvents })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextEvent = {
      ...formData,
      id: editingId ?? Date.now(),
      max_participants: formData.max_participants ? Number(formData.max_participants) : null,
    }

    const nextEvents = editingId
      ? events.map((item) => (item.id === editingId ? nextEvent : item))
      : [...events, nextEvent]

    saveEvents(nextEvents)
    setFormData(emptyEvent)
    setEditingId(null)
    setIsEditorOpen(false)
  }

  const handleEdit = (eventItem) => {
    setEditingId(eventItem.id)
    setFormData({ ...eventItem, max_participants: eventItem.max_participants ?? '' })
    setIsEditorOpen(true)
  }

  const handleDelete = (id) => {
    const nextEvents = events.filter((item) => item.id !== id)
    saveEvents(nextEvents)
    if (editingId === id) {
      setEditingId(null)
      setFormData(emptyEvent)
      setIsEditorOpen(false)
    }
  }

  return (
    <DashboardLayout role="admin" title="Manage Events">
      <div className="admin-page">
        <h2>Manage church events</h2>
        <p>Add, edit, and remove scheduled church activities, outreach programs, and worship events.</p>

        <div className="page-action-bar">
          <span>Keep the church calendar fresh and easy to follow.</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData(emptyEvent); setEditingId(null); setIsEditorOpen(true) }}>Add event</button>
        </div>

        {isEditorOpen && <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditorOpen(false)}>
        <div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="event-editor-title">
          <div className="editor-modal-header"><h3 id="event-editor-title">{editingId ? 'Edit event' : 'Add event'}</h3><button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button></div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Event name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Organizer</label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(event) => setFormData({ ...formData, organizer: event.target.value })}
              />
            </div>

            <div className="form-field full-width">
              <label>Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Start time</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(event) => setFormData({ ...formData, start_time: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>End time</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(event) => setFormData({ ...formData, end_time: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="event-location">Location</label>
              <div className="input-with-action">
                <input
                  id="event-location"
                  type="text"
                  value={formData.location}
                  onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                  required
                />
                <button type="button" className="field-icon-button" title="Choose location on map" onClick={() => window.open('https://www.google.com/maps', '_blank', 'noopener,noreferrer')}>&#128205;</button>
              </div>
            </div>

            <div className="form-field">
              <label>Map link</label>
              <input
                type="url"
                value={formData.map_url}
                onChange={(event) => setFormData({ ...formData, map_url: event.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <ImageUpload label="Poster / event image" value={formData.image} onChange={(image) => setFormData({ ...formData, image })} />

            <div className="form-field">
              <label>Registration status</label>
              <select
                value={formData.registration_status}
                onChange={(event) => setFormData({ ...formData, registration_status: event.target.value })}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-field">
              <label>Max participants</label>
              <input
                type="number"
                min="0"
                value={formData.max_participants}
                onChange={(event) => setFormData({ ...formData, max_participants: event.target.value })}
              />
            </div>

            <div className="form-field">
              <label>Registration deadline</label>
              <input
                type="date"
                value={formData.registration_deadline}
                onChange={(event) => setFormData({ ...formData, registration_deadline: event.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingId ? 'Update event' : 'Add event'}</button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setFormData(emptyEvent)
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        </div>
        </div>}

        <div className="admin-list-wrapper">
          <h3>Existing events</h3>
          <div className="admin-list">
            {events.map((item) => (
              <div key={item.id} className="admin-item-card">
                <div>
                  <strong>{item.title}</strong>
                  <div>{item.date} · {item.location}</div>
                  <div className="meta-badge">{item.registration_status}</div>
                </div>
                <div className="item-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => handleEdit(item)}>Edit</button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EventsCreate
