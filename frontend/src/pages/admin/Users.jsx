import { useMemo, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import * as authApi from '../../api/auth'
import { readSiteContent, writeSiteContent } from '../../data/siteContent'

const permissionOptions = [
  'manage_users',
  'manage_events',
  'manage_sermons',
  'manage_giving',
  'manage_enquiries',
  'manage_ministries',
  'manage_pastors',
  'manage_deacons',
]

const roleOptions = ['admin', 'media', 'secretary']

function Users() {
  const initialUsers = readSiteContent().users
  const [users, setUsers] = useState(initialUsers)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'secretary',
    permissions: [],
  })
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const saveUsers = (nextUsers) => {
    setUsers(nextUsers)
    writeSiteContent({ users: nextUsers })
  }

  const handleRoleChange = (role) => {
    const defaults = {
      admin: permissionOptions,
      media: ['manage_events', 'manage_sermons'],
      secretary: ['manage_giving', 'manage_enquiries'],
    }

    setFormData((previous) => ({
      ...previous,
      role,
      permissions: defaults[role] || [],
    }))
  }

  const handlePermissionToggle = (permission) => {
    setFormData((previous) => {
      const next = previous.permissions.includes(permission)
        ? previous.permissions.filter((item) => item !== permission)
        : [...previous.permissions, permission]

      return { ...previous, permissions: next }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedUser = {
      id: editingId ?? Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      permissions: formData.permissions,
    }

    const nextUsers = editingId
      ? users.map((user) => (user.id === editingId ? trimmedUser : user))
      : [...users, trimmedUser]

    try {
      const response = editingId
        ? await authApi.updateUser(editingId, trimmedUser)
        : await authApi.createUser(trimmedUser)
      if (!editingId && response.user?.id) {
        nextUsers[nextUsers.length - 1].id = response.user.id
      }
    } catch (error) {
      console.error(error)
    }

    saveUsers(nextUsers)
    setFormData({ name: '', email: '', password: '', role: 'secretary', permissions: [] })
    setEditingId(null)
    setIsEditorOpen(false)
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      permissions: user.permissions || [],
    })
    setIsEditorOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await authApi.deleteUser(id)
    } catch (error) {
      console.error(error)
    }
    saveUsers(users.filter((user) => user.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setFormData({ name: '', email: '', password: '', role: 'secretary', permissions: [] })
      setIsEditorOpen(false)
    }
  }

  const permissionSummary = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        permissionCount: user.permissions?.length || 0,
      })),
    [users],
  )

  return (
    <DashboardLayout role="admin" title="Users">
      <div className="admin-page">
        <h2>Manage users</h2>
        <p>Add, remove, and assign roles and permissions for staff and church members.</p>

        <div className="page-action-bar">
          <span>Only administrator-created staff accounts can access the workspace.</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData({ name: '', email: '', password: '', role: 'secretary', permissions: [] }); setEditingId(null); setIsEditorOpen(true) }}>Add staff account</button>
        </div>

        {isEditorOpen && <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditorOpen(false)}>
        <div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="user-editor-title">
          <div className="editor-modal-header"><h3 id="user-editor-title">{editingId ? 'Edit staff account' : 'Add staff account'}</h3><button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button></div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Full name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Initial password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                required={!editingId}
              />
            </div>

            <div className="form-field">
              <label>Role</label>
              <select value={formData.role} onChange={(event) => handleRoleChange(event.target.value)}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="checkbox-grid">
            {permissionOptions.map((permission) => (
              <label key={permission} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                />
                <span>{permission.replace('manage_', '').replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingId ? 'Update user' : 'Add user'}</button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ name: '', email: '', password: '', role: 'secretary', permissions: [] })
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
          <h3>Current users</h3>
          <div className="admin-list">
            {permissionSummary.map((user) => (
              <div key={user.id} className="admin-item-card">
                <div>
                  <strong>{user.name}</strong>
                  <div>{user.email}</div>
                  <div className="meta-badge">{user.role}</div>
                </div>
                <div className="meta-row">
                  <span>{user.permissionCount} permissions</span>
                </div>
                <div className="item-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => handleEdit(user)}>Edit</button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(user.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Users
