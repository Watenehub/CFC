import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'
import { readSiteContent, writeSiteContent } from '../../data/siteContent'

function Settings() {
  const current = readSiteContent()
  const [settings, setSettings] = useState(current.settings)
  const [ministries, setMinistries] = useState(current.ministries)
  const [pastors, setPastors] = useState(current.pastors)
  const [deacons, setDeacons] = useState(current.deacons)

  const makeMinistry = () => ({
    id: Date.now() + Math.random(),
    name: '',
    description: '',
    leader: '',
    meeting_time: '',
    location: '',
    contact: '',
    image: '',
  })

  const makePastor = () => ({
    id: Date.now() + Math.random(),
    name: '',
    title: '',
    bio: '',
    image: '',
  })

  const makeDeacon = () => ({
    id: Date.now() + Math.random(),
    name: '',
    role: '',
    image: '',
  })

  const saveAll = (nextValues) => {
    writeSiteContent(nextValues)
  }

  const saveSettings = () => {
    saveAll({ settings })
  }

  const saveMinistries = () => {
    saveAll({ ministries })
  }

  const saveLeadership = () => {
    saveAll({ pastors, deacons })
  }

  const updateListItem = (list, setList, index, field, value) => {
    const next = [...list]
    next[index] = { ...next[index], [field]: value }
    setList(next)
  }

  const addMinistry = () => setMinistries((previous) => [...previous, makeMinistry()])
  const addPastor = () => setPastors((previous) => [...previous, makePastor()])
  const addDeacon = () => setDeacons((previous) => [...previous, makeDeacon()])

  const removeMinistry = (index) => setMinistries((previous) => previous.filter((_, itemIndex) => itemIndex !== index))
  const removePastor = (index) => setPastors((previous) => previous.filter((_, itemIndex) => itemIndex !== index))
  const removeDeacon = (index) => setDeacons((previous) => previous.filter((_, itemIndex) => itemIndex !== index))

  return (
    <DashboardLayout role="admin" title="Settings">
      <div className="admin-page">
        <h2>Church site settings</h2>
        <p>Update service times, contact details, livestream links, and key leadership information.</p>

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
              <label>Service times</label>
              <textarea rows="3" value={settings.service_times} onChange={(event) => setSettings({ ...settings, service_times: event.target.value })} />
            </div>
            <div className="form-field full-width">
              <label>Livestream URL</label>
              <input value={settings.livestream_url} onChange={(event) => setSettings({ ...settings, livestream_url: event.target.value })} />
            </div>
            <div className="form-field full-width">
              <label>Map link</label>
              <input value={settings.map_url} onChange={(event) => setSettings({ ...settings, map_url: event.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-primary" onClick={saveSettings}>Update site settings</button>
          </div>
        </div>

        <div className="admin-form-block">
          <h3>Ministries</h3>
          {ministries.map((ministry, index) => (
            <div key={ministry.id || index} className="inline-form-grid">
              <input value={ministry.name} onChange={(event) => updateListItem(ministries, setMinistries, index, 'name', event.target.value)} />
              <input value={ministry.description} onChange={(event) => updateListItem(ministries, setMinistries, index, 'description', event.target.value)} />
              <input value={ministry.leader} onChange={(event) => updateListItem(ministries, setMinistries, index, 'leader', event.target.value)} />
              <input value={ministry.meeting_time} onChange={(event) => updateListItem(ministries, setMinistries, index, 'meeting_time', event.target.value)} />
              <input value={ministry.location} onChange={(event) => updateListItem(ministries, setMinistries, index, 'location', event.target.value)} />
              <input value={ministry.contact} onChange={(event) => updateListItem(ministries, setMinistries, index, 'contact', event.target.value)} />
              <ImageUpload label="Photo" value={ministry.image} onChange={(image) => updateListItem(ministries, setMinistries, index, 'image', image)} />
              <button type="button" className="btn btn-danger" onClick={() => removeMinistry(index)}>Remove</button>
            </div>
          ))}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={addMinistry}>Add ministry</button>
            <button type="button" className="btn btn-primary" onClick={saveMinistries}>Update ministries</button>
          </div>
        </div>

        <div className="admin-form-block">
          <h3>Pastors</h3>
          {pastors.map((pastor, index) => (
            <div key={pastor.id || index} className="inline-form-grid">
              <input value={pastor.name} onChange={(event) => updateListItem(pastors, setPastors, index, 'name', event.target.value)} />
              <input value={pastor.title} onChange={(event) => updateListItem(pastors, setPastors, index, 'title', event.target.value)} />
              <textarea rows="3" value={pastor.bio} onChange={(event) => updateListItem(pastors, setPastors, index, 'bio', event.target.value)} />
              <ImageUpload label="Photo" value={pastor.image} onChange={(image) => updateListItem(pastors, setPastors, index, 'image', image)} />
              <button type="button" className="btn btn-danger" onClick={() => removePastor(index)}>Remove</button>
            </div>
          ))}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={addPastor}>Add pastor</button>
            <button type="button" className="btn btn-primary" onClick={saveLeadership}>Update leadership</button>
          </div>
        </div>

        <div className="admin-form-block">
          <h3>Deacons</h3>
          {deacons.map((deacon, index) => (
            <div key={deacon.id || index} className="inline-form-grid">
              <input value={deacon.name} onChange={(event) => updateListItem(deacons, setDeacons, index, 'name', event.target.value)} />
              <input value={deacon.role} onChange={(event) => updateListItem(deacons, setDeacons, index, 'role', event.target.value)} />
              <ImageUpload label="Photo" value={deacon.image} onChange={(image) => updateListItem(deacons, setDeacons, index, 'image', image)} />
              <button type="button" className="btn btn-danger" onClick={() => removeDeacon(index)}>Remove</button>
            </div>
          ))}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={addDeacon}>Add deacon</button>
            <button type="button" className="btn btn-primary" onClick={saveLeadership}>Update deacons</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings
