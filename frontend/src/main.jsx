import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { clearLegacySiteContent } from './data/siteContent'
import './index.css'
import './styles/SharedPages.css'
import './styles/ImageFit.css'
import './utils/scrollAnimations'

clearLegacySiteContent()

const fonts = document.createElement('link')
fonts.rel = 'stylesheet'
fonts.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap'
document.head.appendChild(fonts)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
