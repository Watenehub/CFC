import { useEffect, useState } from 'react'
import { apiCall } from '../api/client'

const POLL_MS = 5000

export default function useLiveSettings(initial = { livestream_url: '', is_live: false }) {
  const [settings, setSettings] = useState(initial)

  useEffect(() => {
    let active = true
    const load = () => {
      if (document.visibilityState === 'hidden') return
      apiCall('/api/settings', { cache: 'no-store' })
        .then((data) => { if (active && data) setSettings(data) })
        .catch(() => {})
    }
    load()
    const timer = setInterval(load, POLL_MS)
    document.addEventListener('visibilitychange', load)
    window.addEventListener('focus', load)
    window.addEventListener('online', load)
    return () => {
      active = false
      clearInterval(timer)
      document.removeEventListener('visibilitychange', load)
      window.removeEventListener('focus', load)
      window.removeEventListener('online', load)
    }
  }, [])

  return settings
}
