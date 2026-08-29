import { useState } from 'react'
import gallery from '../data/galleryImages'
import '../styles/ModernDesignSystem.css'
import './Gallery.css'

function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState({ category: null, index: 0 })

  const openLightbox = (category, index) => {
    setCurrent({ category, index })
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const next = () => {
    const arr = gallery[current.category]
    setCurrent((c) => ({ category: c.category, index: (c.index + 1) % arr.length }))
  }

  const prev = () => {
    const arr = gallery[current.category]
    setCurrent((c) => ({ category: c.category, index: (c.index - 1 + arr.length) % arr.length }))
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <h1 className="section-title">Photo Gallery</h1>
        {Object.keys(gallery).map((category) => (
          <section key={category} className="gallery-section">
            <h2 className="gallery-category">{category.replace(/([A-Z])/g, ' $1')}</h2>
            <div className="masonry-gallery">
              {gallery[category].map((src, i) => (
                <div key={src} className={`gallery-item`} onClick={() => openLightbox(category, i)}>
                  <img src={src} alt={`${category} ${i + 1}`} />
                  <div className="gallery-overlay">
                    <div className="gallery-caption">View</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className={`lightbox ${lightboxOpen ? 'active' : ''}`} role="dialog" aria-modal="true">
          {lightboxOpen && (
            <>
              <button className="lightbox-close" onClick={closeLightbox}>×</button>
              <button className="lightbox-nav lightbox-prev" onClick={prev}>‹</button>
              <img className="lightbox-image" src={gallery[current.category][current.index]} alt="Gallery" />
              <button className="lightbox-nav lightbox-next" onClick={next}>›</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery
