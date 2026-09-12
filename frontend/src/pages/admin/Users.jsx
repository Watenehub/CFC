import { useState, useEffect, useMemo } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ActionButton from '../../components/ActionButton'
import * as authApi from '../../api/auth'
import { ALL_PERMISSIONS, ROLE_PERMISSIONS, STAFF_ROLES, permissionLabel } from '../../utils/permissions'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'guest',
  permissions: [],
}

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await authApi.getUsers()
      setUsers(response)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (role) => {
    setFormData((previous) => ({
      ...previous,
      role,
      permissions: ROLE_PERMISSIONS[role] ? [...ROLE_PERMISSIONS[role]] : [],
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

  const openExistingUser = (user) => {
    setEditingId(user.id)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'guest',
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
    })
    setIsEditorOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.role) {
      setError('Please fill in name, email, and role.')
      return
    }

    if (!editingId && !formData.password) {
      setError('Please set an initial password for the new account.')
      return
    }

    const trimmedUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      permissions: formData.permissions,
    }

    if (formData.password) {
      trimmedUser.password = formData.password
    }

    setSaving(true)
    try {
      if (editingId) {
        await authApi.updateUser(editingId, trimmedUser)
      } else {
        await authApi.createUser(trimmedUser)
      }

      await fetchUsers()
      setFormData(emptyForm)
      setEditingId(null)
      setIsEditorOpen(false)
    } catch (err) {
      const existing = err.payload?.existing_user
      if (err.status === 409 && existing) {
        setError(err.message)
        openExistingUser(existing)
      } else {
        setError(err.message || 'Failed to save user')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    setError('')
    try {
      await authApi.deleteUser(id)
      await fetchUsers()
      if (editingId === id) {
        setEditingId(null)
        setFormData(emptyForm)
        setIsEditorOpen(false)
      }
    } catch (err) {
      setError(err.message || 'Failed to remove user')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddUser = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setError('')
    setIsEditorOpen(true)
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
        <p>Add staff or guest accounts and assign exactly the rights they should have on the site.</p>
        {error && <p className="error-state">{error}</p>}

        <div className="page-action-bar">
          <span>Guest accounts start with no access. Tick only the areas this person should manage.</span>
          <ActionButton className="btn btn-primary" onClick={handleAddUser}>Add guest / staff</ActionButton>
        </div>

        {loading ? (
          <div className="admin-list-wrapper">
            <p>Loading users...</p>
          </div>
        ) : (
          <>
        {isEditorOpen && <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditorOpen(false)}>
        <div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="user-editor-title">
          <div className="editor-modal-header"><h3 id="user-editor-title">{editingId ? 'Edit account' : 'Add guest or staff account'}</h3><button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button></div>
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
              <label>{editingId ? 'New password (optional)' : 'Initial password'}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                required={!editingId}
                autoComplete="new-password"
              />
            </div>

            <div className="form-field">
              <label>Role</label>
              <select value={formData.role} onChange={(event) => handleRoleChange(event.target.value)}>
                {STAFF_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="checkbox-grid">
            {ALL_PERMISSIONS.map((permission) => (
              <label key={permission} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                />
                <span>{permissionLabel(permission)}</span>
              </label>
            ))}
          </div>

          <div className="form-actions">
            <ActionButton type="submit" className="btn btn-primary" loading={saving}>
              {editingId ? 'Update user' : 'Add user'}
            </ActionButton>
            {editingId && (
              <ActionButton
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setFormData(emptyForm)
                }}
              >
                Cancel
              </ActionButton>
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
                  <div className="permission-chips">
                    {(user.permissions || []).map((permission) => (
                      <span key={permission} className="permission-chip">{permissionLabel(permission)}</span>
                    ))}
                    {!user.permissions?.length && <span className="permission-chip">No extra rights</span>}
                  </div>
                </div>
                <div className="meta-row">
                  <span>{user.permissionCount} permissions</span>
                </div>
                <div className="item-actions">
                  <ActionButton className="btn btn-secondary" onClick={() => openExistingUser(user)}>Edit</ActionButton>
                  <ActionButton className="btn btn-danger" loading={deletingId === user.id} onClick={() => handleDelete(user.id)}>Remove</ActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Users
