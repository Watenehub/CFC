import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as enquiriesApi from '../../api/enquiries'

function Enquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState('New')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      setError('')
      const data = await enquiriesApi.getEnquiries()
      setEnquiries(data)
    } catch (err) {
      setError(err.message || 'Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  const selected = enquiries.find((item) => item.id === selectedId) || null

  const openEnquiry = (enquiry) => {
    setSelectedId(enquiry.id)
    setResponse(enquiry.response || '')
    setStatus(enquiry.status || 'New')
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    if (!selectedId) return
    setSaving(true)
    setError('')

    try {
      await enquiriesApi.updateEnquiry(selectedId, { status, response })
      await fetchEnquiries()
    } catch (err) {
      setError(err.message || 'Failed to update enquiry')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await enquiriesApi.deleteEnquiry(id)
      if (selectedId === id) {
        setSelectedId(null)
        setResponse('')
        setStatus('New')
      }
      await fetchEnquiries()
    } catch (err) {
      setError(err.message || 'Failed to delete enquiry')
    }
  }

  return (
    <DashboardLayout role="admin" title="Enquiries">
      <div className="admin-page">
        <h2>Contact enquiries</h2>
        <p>Messages sent from the website contact form are listed here so the church office can reply.</p>
        {error && <p className="error-state">{error}</p>}

        {loading ? <p>Loading enquiries...</p> : (
          <div className="admin-list-wrapper">
            <h3>Inbox ({enquiries.length})</h3>
            <div className="admin-list">
              {enquiries.map((item) => (
                <div key={item.id} className="admin-item-card">
                  <div>
                    <strong>{item.subject}</strong>
                    <div>{item.name} · {item.email}</div>
                    <div className="meta-badge">{item.status}</div>
                  </div>
                  <div className="item-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => openEnquiry(item)}>Open</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              {!enquiries.length && <p className="empty-admin-state">No enquiries yet.</p>}
            </div>
          </div>
        )}

        {selected && (
          <div className="admin-form-block" style={{ marginTop: '1.5rem' }}>
            <h3>{selected.subject}</h3>
            <p><strong>From:</strong> {selected.name} ({selected.email})</p>
            {selected.phone && <p><strong>Phone:</strong> {selected.phone}</p>}
            <p>{selected.message}</p>

            <form className="admin-form" onSubmit={handleUpdate}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Status</label>
                  <select value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="form-field full-width">
                  <label>Office notes / response</label>
                  <textarea rows="4" value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Add a note or reply summary" />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update enquiry'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedId(null)}>Close</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Enquiries
