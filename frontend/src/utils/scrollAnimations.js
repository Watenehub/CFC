const ANIMATED_SELECTOR = '.fade-up, .fade-in, .slide-up, .scale-in'

let intersectionObserver = null
let mutationObserver = null

function observeNewElements() {
  if (!intersectionObserver || typeof document === 'undefined') return
  document.querySelectorAll(ANIMATED_SELECTOR).forEach((element) => {
    if (element.classList.contains('visible')) return
    intersectionObserver.observe(element)
  })
}

export const initScrollAnimations = () => {
  if (typeof document === 'undefined') return null

  if (!intersectionObserver) {
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          intersectionObserver.unobserve(entry.target)
        }
      })
    }, {
      root: null,
      rootMargin: '80px 0px',
      threshold: 0.05,
    })
  }

  observeNewElements()

  if (!mutationObserver && document.body) {
    mutationObserver = new MutationObserver(observeNewElements)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
  }

  return intersectionObserver
}

export const cleanupScrollAnimations = (observer) => {
  if (observer && observer !== intersectionObserver) {
    observer.disconnect()
  }
}

if (typeof document !== 'undefined') {
  const start = () => initScrollAnimations()
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
}
