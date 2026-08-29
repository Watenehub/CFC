import '../styles/PageHero.css'

function PageHero({ title, subtitle, eyebrow, image = '/images/cornerstone/hero-main.jpg', compact = false }) {
  return (
    <section className={`page-hero${compact ? ' page-hero--compact' : ''}`}>
      <div className="page-hero-bg">
        <img src={image} alt="" aria-hidden="true" />
        <div className="page-hero-overlay" />
      </div>
      <div className="page-hero-content container">
        {eyebrow && <span className="page-hero-eyebrow fade-up">{eyebrow}</span>}
        <h1 className="page-hero-title fade-up">{title}</h1>
        {subtitle && <p className="page-hero-subtitle fade-up">{subtitle}</p>}
      </div>
    </section>
  )
}

export default PageHero
