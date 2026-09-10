/** Legacy browser CMS key — cleared on app start so all content comes from MongoDB. */
export const SITE_CONTENT_KEY = 'cornerstone_site_content'

export function clearLegacySiteContent() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(SITE_CONTENT_KEY)
  } catch (error) {
    // Ignore storage access errors
  }
}
