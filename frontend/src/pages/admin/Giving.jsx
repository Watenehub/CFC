import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'
import { readSiteContent, writeSiteContent } from '../../data/siteContent'

const emptyGiving = {
  id: '',
  title: '',
  description: '',
  category: 'Offering',
  payment_method: 'M-Pesa',
  mpesa_business_no: '',
  mpesa_account_no: '',
  bank_name: '',
  bank_account_name: '',
  bank_account_no: '',
  cheque_payee: '',
  poster: '',
}

function Giving() {
  const [givingOptions, setGivingOptions] = useState(readSiteContent().giving)
  const [formData, setFormData] = useState(emptyGiving)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const selectedPaymentModes = formData.payment_method === 'Both'
    ? ['M-Pesa', 'Bank Transfer']
    : formData.payment_method ? formData.payment_method.split(' + ') : []

  const togglePaymentMode = (mode) => {
    const nextModes = selectedPaymentModes.includes(mode)
      ? selectedPaymentModes.filter((item) => item !== mode)
      : [...selectedPaymentModes, mode]
    setFormData({ ...formData, payment_method: nextModes.join(' + ') })
  }

  const saveGiving = (nextOptions) => {
    setGivingOptions(nextOptions)
    writeSiteContent({ giving: nextOptions })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextGiving = {
      ...formData,
      id: editingId ?? Date.now(),
      payment_details: [
        formData.mpesa_business_no && `Business number: ${formData.mpesa_business_no}`,
        formData.mpesa_account_no && `M-Pesa account: ${formData.mpesa_account_no}`,
        formData.bank_name && `Bank: ${formData.bank_name}`,
        formData.bank_account_name && `Account name: ${formData.bank_account_name}`,
        formData.bank_account_no && `Account number: ${formData.bank_account_no}`,
        formData.cheque_payee && `Cheque payable to: ${formData.cheque_payee}`,
      ].filter(Boolean).join('\n'),
    }

    const nextOptions = editingId
      ? givingOptions.map((item) => (item.id === editingId ? nextGiving : item))
      : [...givingOptions, nextGiving]

    saveGiving(nextOptions)
    setFormData(emptyGiving)
    setEditingId(null)
    setIsEditorOpen(false)
  }

  const handleEdit = (option) => {
    setEditingId(option.id)
    setFormData({ ...emptyGiving, ...option })
    setIsEditorOpen(true)
  }

  const handleDelete = (id) => {
    const nextOptions = givingOptions.filter((item) => item.id !== id)
    saveGiving(nextOptions)
    if (editingId === id) {
      setEditingId(null)
      setFormData(emptyGiving)
      setIsEditorOpen(false)
    }
  }

  return (
    <DashboardLayout role="admin" title="Manage Giving">
      <div className="admin-page">
        <h2>Manage giving</h2>
        <p>Create campaigns, offerings, and channels for online and bank-based support.</p>

        <div className="page-action-bar">
          <span>Shape the giving options shown on the public giving page.</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData(emptyGiving); setEditingId(null); setIsEditorOpen(true) }}>Add giving option</button>
        </div>

        {isEditorOpen && <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditorOpen(false)}>
        <div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="giving-editor-title">
          <div className="editor-modal-header"><h3 id="giving-editor-title">{editingId ? 'Edit giving option' : 'Add giving option'}</h3><button type="button" className="modal-close" onClick={() => setIsEditorOpen(false)} aria-label="Close">&times;</button></div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Giving title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Category</label>
              <input
                list="giving-category-options"
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                placeholder="Choose or type a category"
                required
              />
              <datalist id="giving-category-options">
                {['Offering', 'Tithe', 'Missions', 'Building Fund', 'Donations', 'Other'].map((category) => <option key={category} value={category} />)}
              </datalist>
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

            <div className="form-field full-width">
              <span className="form-field-label">Giving mode</span>
              <div className="radio-group checkbox-mode-group">
                {['M-Pesa', 'Bank Transfer', 'Cheque', 'Cash', 'Card'].map((method) => (
                  <label key={method} className="radio-item">
                    <input type="checkbox" checked={selectedPaymentModes.includes(method)} onChange={() => togglePaymentMode(method)} />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {selectedPaymentModes.includes('M-Pesa') && (
              <div className="payment-prompt">
                <h4>M-Pesa details</h4>
                <input placeholder="Business number / Paybill" value={formData.mpesa_business_no} onChange={(event) => setFormData({ ...formData, mpesa_business_no: event.target.value })} required />
                <input placeholder="Account number" value={formData.mpesa_account_no} onChange={(event) => setFormData({ ...formData, mpesa_account_no: event.target.value })} required />
              </div>
            )}

            {selectedPaymentModes.includes('Bank Transfer') && (
              <div className="payment-prompt">
                <h4>Bank details</h4>
                <input placeholder="Bank name" value={formData.bank_name} onChange={(event) => setFormData({ ...formData, bank_name: event.target.value })} required />
                <input placeholder="Account name" value={formData.bank_account_name} onChange={(event) => setFormData({ ...formData, bank_account_name: event.target.value })} required />
                <input placeholder="Account number" value={formData.bank_account_no} onChange={(event) => setFormData({ ...formData, bank_account_no: event.target.value })} required />
              </div>
            )}

            {selectedPaymentModes.includes('Cheque') && (
              <div className="payment-prompt"><h4>Cheque details</h4><input placeholder="Cheque payable to" value={formData.cheque_payee} onChange={(event) => setFormData({ ...formData, cheque_payee: event.target.value })} required /></div>
            )}

            <ImageUpload label="Giving poster / image" value={formData.poster} onChange={(poster) => setFormData({ ...formData, poster })} />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{editingId ? 'Update giving option' : 'Add giving option'}</button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setFormData(emptyGiving)
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
          <h3>Existing giving options</h3>
          <div className="admin-list">
            {givingOptions.map((item) => (
              <div key={item.id} className="admin-item-card">
                <div>
                  <strong>{item.title}</strong>
                  <div>{item.category}</div>
                  <div className="meta-badge">{item.payment_method}</div>
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

export default Giving
