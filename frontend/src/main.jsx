import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { clearLegacySiteContent } from './data/siteContent'
import './index.css'
import './styles/SharedPages.css'
import './utils/scrollAnimations'

clearLegacySiteContent()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
