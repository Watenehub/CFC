import { useRef, useState } from 'react'

function MultiImageUpload({ files, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const readFiles = (fileList) => {
    const selectedFiles = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'))
    Promise.all(selectedFiles.map((file) => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve({ id: `${file.name}-${file.lastModified}-${Math.random()}`, image: reader.result, name: file.name })
      reader.readAsDataURL(file)
    }))).then((images) => onChange([...files, ...images]))
  }

  return (
    <div className="image-upload-field">
      <span className="form-field-label">Gallery images</span>
      <div
        className={`image-dropzone multi-image-dropzone${dragging ? ' is-dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
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
        <strong>{files.length ? 'Add more images' : 'Upload multiple images'}</strong>
        <small>Choose several files from your PC or drag and drop them here</small>
      </div>
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
