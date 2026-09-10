import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page-body" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="section-eyebrow">404</p>
        <h1 className="section-heading">Page not found</h1>
        <p className="section-subheading" style={{ margin: '0 auto 1.5rem', maxWidth: '28rem' }}>
          The page you are looking for does not exist or has moved.
        </p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </div>
  )
}

export default NotFound
