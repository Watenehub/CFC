import { useState, useEffect } from 'react'
import * as galleryApi from '../api/gallery'
import PageHero from '../components/PageHero'
import '../styles/ModernDesignSystem.css'
import './Gallery.css'

function Gallery() {
  const [galleryContent, setGalleryContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [current, setCurrent] = useState({ category: null, index: 0 })

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await galleryApi.getGallery()
        setGalleryContent(data)
      } catch (err) {
        console.error(err)
        setGalleryContent([])
      } finally {
        setLoading(false)
      }
    }
    loadGallery()
  }, [])

  const galleryByCategory = galleryContent.reduce((groups, item) => ({
    ...groups,
    [item.category || 'General']: [...(groups[item.category || 'General'] || []), {
      ...item,
      image: item.image || item.image_url,
    }],
  }), {})

  const categories = Object.keys(galleryByCategory)

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
      <PageHero
        eyebrow="Life together"
        title="Photo Gallery"
        subtitle="Moments from worship, fellowship, outreach, and celebrations at Cornerstone Family Chapel."
        image="/images/cornerstone/page_07/page07_photo032_music_extravaganza.jpg"
      />
      <div className="page-body">
        <div className="container">
          {loading ? (
            <div className="loading-state">Loading gallery...</div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <p>No gallery photos yet. Check back soon as our media team shares more from church life.</p>
            </div>
          ) : categories.map((category) => (
            <section key={category} className="gallery-section">
              <h2 className="gallery-category">{category.replace(/([A-Z])/g, ' $1').trim()}</h2>
              <div className="masonry-gallery">
                {galleryByCategory[category].map((photo, i) => (
                  <div key={photo.id || photo.image} className="gallery-item" onClick={() => openLightbox(category, i)}>
                    <img src={photo.image} alt={photo.description || `${category} ${i + 1}`} loading="lazy" />
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
    </div>
  )
}

export default Gallery
