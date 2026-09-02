import { useRef, useState } from 'react'

function ImageUpload({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="image-upload-field">
      <span className="form-field-label">{label}</span>
      <div
        className={`image-dropzone${dragging ? ' is-dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          readFile(event.dataTransfer.files[0])
        }}
      >
        {value ? <img src={value} alt="Selected preview" className="image-upload-preview" /> : <span className="upload-icon" aria-hidden="true">&#128444;</span>}
        <span>{value ? 'Change image' : 'Upload image'}</span>
        <small>Choose from PC or drag and drop</small>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(event) => readFile(event.target.files[0])}
      />
    </div>
  )
}

export default ImageUpload
