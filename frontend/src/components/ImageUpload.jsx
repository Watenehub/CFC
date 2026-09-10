import { useRef, useState } from 'react'
import { uploadImage } from '../api/upload'

function ImageUpload({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload-field">
      <span className="form-field-label">{label}</span>
      <div
        className={`image-dropzone${dragging ? ' is-dragging' : ''}${uploading ? ' is-uploading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFile(event.dataTransfer.files[0])
        }}
      >
        {value ? <img src={value} alt="Selected preview" className="image-upload-preview" /> : <span className="upload-icon" aria-hidden="true">&#128444;</span>}
        <span>{uploading ? 'Uploading…' : value ? 'Change image' : 'Upload image'}</span>
        <small>Choose from PC or drag and drop (max 8MB)</small>
      </div>
      {error && <p className="upload-error">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(event) => handleFile(event.target.files[0])}
      />
    </div>
  )
}

export default ImageUpload
