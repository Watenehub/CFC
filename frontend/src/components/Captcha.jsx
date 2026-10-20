import { useEffect, useRef } from 'react'

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise

const loadScript = () => {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const el = document.createElement('script')
      el.src = SCRIPT_SRC
      el.async = true
      el.onload = resolve
      el.onerror = reject
      document.head.appendChild(el)
    })
  }
  return scriptPromise
}

export const captchaEnabled = Boolean(SITE_KEY)

// Renders a Cloudflare Turnstile widget; `resetKey` changes force a fresh challenge.
export default function Captcha({ onToken, resetKey }) {
  const ref = useRef(null)
  const widgetId = useRef(null)

  useEffect(() => {
    if (!SITE_KEY) return undefined
    let cancelled = false
    loadScript().then(() => {
      if (cancelled || !ref.current || !window.turnstile) return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      })
    }).catch(() => onToken(''))
    return () => {
      cancelled = true
      if (widgetId.current != null && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  useEffect(() => {
    if (widgetId.current != null && window.turnstile) {
      onToken('')
      window.turnstile.reset(widgetId.current)
    }
  }, [resetKey])

  return SITE_KEY ? <div ref={ref} className="captcha-box" /> : null
}
