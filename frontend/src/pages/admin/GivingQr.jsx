import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import DashboardLayout from '../../components/DashboardLayout'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://cfckenya.vercel.app').replace(/\/$/, '')
const GIVE_URL = `${SITE_URL}/quick-give`
const SIZE = 1024
const MARGIN = 80
const GREEN = '#15803d'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

async function drawQr(canvas) {
  const qr = QRCode.create(GIVE_URL, { errorCorrectionLevel: 'H' })
  const count = qr.modules.size
  const data = qr.modules.data
  const cell = (SIZE - MARGIN * 2) / count
  const ctx = canvas.getContext('2d')
  canvas.width = SIZE
  canvas.height = SIZE

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, SIZE, SIZE)

  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7)
  const center = SIZE / 2
  const clearRadius = SIZE * 0.17

  ctx.fillStyle = GREEN
  for (let r = 0; r < count; r += 1) {
    for (let c = 0; c < count; c += 1) {
      if (!data[r * count + c] || isFinder(r, c)) continue
      const x = MARGIN + c * cell
      const y = MARGIN + r * cell
      if (Math.hypot(x + cell / 2 - center, y + cell / 2 - center) < clearRadius) continue
      ctx.beginPath()
      ctx.roundRect(x, y, cell, cell, cell * 0.4)
      ctx.fill()
    }
  }

  const finders = [[0, 0], [0, count - 7], [count - 7, 0]]
  finders.forEach(([r, c]) => {
    const x = MARGIN + c * cell
    const y = MARGIN + r * cell
    ctx.fillStyle = GREEN
    roundRect(ctx, x, y, cell * 7, cell * 7, cell * 1.2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, x + cell, y + cell, cell * 5, cell * 5, cell * 1.4)
    ctx.fill()
    ctx.fillStyle = GREEN
    roundRect(ctx, x + cell * 2, y + cell * 2, cell * 3, cell * 3, cell * 1)
    ctx.fill()
  })

  const logo = await loadImage('/logo.png')
  const badge = SIZE * 0.3
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, center - badge / 2, center - badge / 2, badge, badge, badge * 0.18)
  ctx.fill()
  ctx.strokeStyle = GREEN
  ctx.lineWidth = 6
  ctx.stroke()
  // The source logo has wide transparent padding; crop to the artwork.
  const sx = logo.width * 0.26
  const sy = logo.height * 0.36
  const sw = logo.width * 0.48
  const sh = logo.height * 0.28
  const pad = badge * 0.08
  const dw = badge - pad * 2
  const dh = dw * (sh / sw)
  ctx.drawImage(logo, sx, sy, sw, sh, center - dw / 2, center - dh / 2, dw, dh)
}

function GivingQr() {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    drawQr(canvasRef.current).then(() => setReady(true)).catch(() => setNotice('Could not generate the QR code.'))
  }, [])

  const toBlob = () => new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png'))

  const download = async () => {
    const blob = await toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cornerstone-giving-qr.png'
    link.click()
    URL.revokeObjectURL(url)
  }

  const nativeShare = async () => {
    const blob = await toBlob()
    const file = new File([blob], 'cornerstone-giving-qr.png', { type: 'image/png' })
    const payload = { title: 'Give to Cornerstone Family Chapel', text: `Scan or tap to give: ${GIVE_URL}`, url: GIVE_URL }
    try {
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ ...payload, files: [file] })
      else if (navigator.share) await navigator.share(payload)
      else setNotice('Sharing is not supported on this device. Use the buttons below.')
    } catch {
      // user cancelled the share sheet
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(GIVE_URL)
      setNotice('Link copied.')
    } catch {
      setNotice(GIVE_URL)
    }
  }

  const text = encodeURIComponent('Give to Cornerstone Family Chapel')
  const link = encodeURIComponent(GIVE_URL)
  const channels = [
    ['WhatsApp', `https://wa.me/?text=${text}%20${link}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${link}`],
    ['X', `https://twitter.com/intent/tweet?text=${text}&url=${link}`],
    ['Telegram', `https://t.me/share/url?url=${link}&text=${text}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${link}`],
    ['Email', `mailto:?subject=${text}&body=${link}`],
  ]

  return (
    <DashboardLayout role="admin" title="Giving QR Code">
      <div className="admin-page">
        <h2>Giving QR code</h2>
        <p>Members who scan this code open a small popup where they choose a giving type, enter their M-PESA number and amount, and receive the payment prompt.</p>
        {notice && <p role="status">{notice}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
          <canvas ref={canvasRef} style={{ width: 'min(100%, 320px)', height: 'auto', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }} aria-label="Giving QR code" />
          <code style={{ wordBreak: 'break-all' }}>{GIVE_URL}</code>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={download} disabled={!ready}>Download image</button>
            <button type="button" className="btn btn-secondary" onClick={nativeShare} disabled={!ready}>Share image</button>
            <button type="button" className="btn btn-secondary" onClick={copyLink}>Copy link</button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {channels.map(([name, href]) => (
              <a key={name} className="btn btn-secondary" href={href} target="_blank" rel="noopener noreferrer">{name}</a>
            ))}
          </div>
          <small>Tip: for Instagram, TikTok or Facebook posts, download the image and upload it, or use "Share image" on your phone.</small>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GivingQr
