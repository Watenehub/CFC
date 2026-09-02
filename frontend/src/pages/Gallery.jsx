import { useState, useEffect } from 'react'
import gallery from '../data/galleryImages'
import { readSiteContent } from '../data/siteContent'
import '../styles/ModernDesignSystem.css'
import './Gallery.css'

function Gallery() {
  const [galleryContent, setGalleryContent] = useState(readSiteContent().gallery)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState({ category: null, index: 0 })

  useEffect(() => {
    const updateGallery = () => setGalleryContent(readSiteContent().gallery)
    window.addEventListener('cornerstone-content-updated', updateGallery)
    return () => window.removeEventListener('cornerstone-content-updated', updateGallery)
  }, [])

  const galleryByCategory = galleryContent?.length
    ? galleryContent.reduce((groups, item) => ({ ...groups, [item.category]: [...(groups[item.category] || []), item] }), {})
    : Object.fromEntries(Object.entries(gallery).map(([category, images]) => [category, images.map((image) => ({ image, description: '' }))]))

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
    const arr = galleryByCategory[current.category]
    setCurrent((c) => ({ category: c.category, index: (c.index + 1) % arr.length }))
  }

  const prev = () => {
    const arr = galleryByCategory[current.category]
    setCurrent((c) => ({ category: c.category, index: (c.index - 1 + arr.length) % arr.length }))
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <h1 className="section-title">Photo Gallery</h1>
        {Object.keys(galleryByCategory).map((category) => (
          <section key={category} className="gallery-section">
            <h2 className="gallery-category">{category.replace(/([A-Z])/g, ' $1')}</h2>
            <div className="masonry-gallery">
              {galleryByCategory[category].map((photo, i) => (
                <div key={photo.id || photo.image} className={`gallery-item`} onClick={() => openLightbox(category, i)}>
                  <img src={photo.image} alt={photo.description || `${category} ${i + 1}`} />
                  <div className="gallery-overlay">
                    <div className="gallery-caption">{photo.description || 'View'}</div>
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
              <img className="lightbox-image" src={galleryByCategory[current.category][current.index].image} alt="Gallery" />
              <button className="lightbox-nav lightbox-next" onClick={next}>›</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gallery
