import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'
import MultiImageUpload from '../../components/MultiImageUpload'
import { readSiteContent, writeSiteContent } from '../../data/siteContent'

const categories = ['Worship', 'Conferences', 'Membership', 'ChildrenAndTeens', 'Media', 'MedicalOutreach', 'CommunityOutreach', 'CurrentNeeds']
const emptyPhoto = { id: '', image: '', description: '', category: 'Worship' }

function GalleryManager() {
  const [photos, setPhotos] = useState(readSiteContent().gallery || [])
  const [formData, setFormData] = useState(emptyPhoto)
  const [editingId, setEditingId] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [pendingImages, setPendingImages] = useState([])

  const save = (nextPhotos) => {
    setPhotos(nextPhotos)
    writeSiteContent({ gallery: nextPhotos })
  }

  const reset = () => {
    setFormData(emptyPhoto)
    setEditingId(null)
    setIsEditorOpen(false)
    setPendingImages([])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!editingId && pendingImages.length === 0) return
    if (editingId) {
      save(photos.map((item) => item.id === editingId ? { ...formData, id: editingId } : item))
    } else {
      const newPhotos = pendingImages.map((file) => ({
        id: file.id,
        image: file.image,
        description: formData.description,
        category: formData.category,
      }))
      save([...photos, ...newPhotos])
    }
    reset()
  }

  const edit = (photo) => {
    setEditingId(photo.id)
    setFormData({ ...emptyPhoto, ...photo })
    setIsEditorOpen(true)
  }

  const remove = (id) => save(photos.filter((photo) => photo.id !== id))

  const allCategories = [...new Set([...categories, ...photos.map((photo) => photo.category).filter(Boolean)])]
  const groupedPhotos = allCategories.map((category) => ({
    category,
    items: photos.filter((photo) => photo.category === category),
  }))

  return (
    <DashboardLayout role="media" title="Gallery Studio">
      <div className="admin-page">
        <h2>Gallery Studio</h2>
        <p>Upload, describe, categorize, edit, and remove the images shown on the public gallery.</p>
        <div className="page-action-bar">
          <span>{photos.length} uploaded image{photos.length === 1 ? '' : 's'}</span>
          <button type="button" className="btn btn-primary" onClick={() => { setFormData(emptyPhoto); setPendingImages([]); setEditingId(null); setIsEditorOpen(true) }}>Add gallery image</button>
        </div>

        {isEditorOpen && <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditorOpen(false)}>
          <div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-editor-title">
            <div className="editor-modal-header"><h3 id="gallery-editor-title">{editingId ? 'Edit gallery image' : 'Add gallery image'}</h3><button type="button" className="modal-close" onClick={reset} aria-label="Close">&times;</button></div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Gallery category</label>
                  <input
                    list="gallery-category-options"
                    value={formData.category}
                    onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                    placeholder="Choose or type a category"
                    required
                  />
                  <datalist id="gallery-category-options">
                    {allCategories.map((category) => <option key={category} value={category.replace(/([A-Z])/g, ' $1')} />)}
                  </datalist>
                </div>
                <div className="form-field full-width">
                  <label>Description</label>
                  <textarea rows="4" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} required />
                </div>
                {editingId ? <ImageUpload label="Gallery image" value={formData.image} onChange={(image) => setFormData({ ...formData, image })} /> : <MultiImageUpload files={pendingImages} onChange={setPendingImages} />}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={!editingId && pendingImages.length === 0}>{editingId ? 'Update image' : `Add ${pendingImages.length || ''} image${pendingImages.length === 1 ? '' : 's'}`}</button>
                <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>
              </div>
            </form>
          </div>
        </div>}

        <div className="gallery-admin-groups">
          {groupedPhotos.map(({ category, items }) => (
            <section key={category} className="admin-form-block">
              <h3>{category.replace(/([A-Z])/g, ' $1')}</h3>
              {items.length === 0 ? <p className="empty-admin-state">No uploaded images in this category.</p> : (
                <div className="admin-gallery-grid">
                  {items.map((photo) => (
                    <article key={photo.id} className="admin-gallery-card">
                      <img src={photo.image} alt={photo.description || category} />
                      <div className="admin-gallery-card-body"><p>{photo.description}</p><div className="item-actions"><button type="button" className="btn btn-secondary" onClick={() => edit(photo)}>Edit</button><button type="button" className="btn btn-danger" onClick={() => remove(photo.id)}>Remove</button></div></div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GalleryManager
