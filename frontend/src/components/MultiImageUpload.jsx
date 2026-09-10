import { useRef, useState } from 'react'
import { uploadImage } from '../api/upload'

function MultiImageUpload({ files, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const readFiles = async (fileList) => {
    const selectedFiles = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'))
    if (!selectedFiles.length) return

    setUploading(true)
    setError('')
    try {
      const uploaded = []
      for (const file of selectedFiles) {
        const url = await uploadImage(file)
        uploaded.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, image: url, name: file.name })
      }
      onChange([...files, ...uploaded])
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload-field">
      <span className="form-field-label">Gallery images</span>
      <div
        className={`image-dropzone multi-image-dropzone${dragging ? ' is-dragging' : ''}${uploading ? ' is-uploading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          readFiles(event.dataTransfer.files)
        }}
      >
        <span className="upload-icon" aria-hidden="true">&#128444;</span>
        <strong>{uploading ? 'Uploading…' : files.length ? 'Add more images' : 'Upload multiple images'}</strong>
        <small>Choose several files or drag and drop (max 8MB each)</small>
      </div>
      {error && <p className="upload-error">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" multiple className="visually-hidden" onChange={(event) => readFiles(event.target.files)} />
      {files.length > 0 && (
        <div className="multi-image-preview-grid">
          {files.map((file) => (
            <div key={file.id} className="multi-image-preview">
              <img src={file.image} alt={file.name} />
              <button type="button" className="preview-remove" onClick={() => onChange(files.filter((item) => item.id !== file.id))} aria-label={`Remove ${file.name}`}>&times;</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiImageUpload
