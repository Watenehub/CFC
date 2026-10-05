export const API_BASE = import.meta.env.VITE_API_BASE || ''

let csrfToken = ''
let csrfPromise = null
const getCache = new Map()
const GET_TTL_MS = 30000

function isJsonMethod(method) {
  return method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS'
}

function csrfFailed(data, status) {
  return status === 400 && (data?.code === 'csrf_failed' || /security token/i.test(data?.error || ''))
}

export function resetCsrfToken() {
  csrfToken = ''
  csrfPromise = null
}

export async function getCsrfToken(force = false) {
  if (csrfToken && !force) return csrfToken
  if (csrfPromise && !force) return csrfPromise

  csrfPromise = fetch(`${API_BASE}/api/csrf-token`, {
    credentials: 'include',
    cache: 'no-store',
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || 'Could not start a secure session')
      }
      csrfToken = data.csrf_token || ''
      return csrfToken
    })
    .finally(() => {
      csrfPromise = null
    })

  return csrfPromise
}

async function parseBody(response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return null
}

export async function apiCall(endpoint, options = {}, retry = true) {
  const method = (options.method || 'GET').toUpperCase()

  if (method !== 'GET') {
    getCache.clear()
  } else if (retry && !options.cache && !endpoint.startsWith('/api/auth')) {
    const hit = getCache.get(endpoint)
    if (hit && Date.now() - hit.at < GET_TTL_MS) return hit.promise
    const promise = request(endpoint, options, retry)
    getCache.set(endpoint, { at: Date.now(), promise })
    promise.catch(() => getCache.delete(endpoint))
    return promise
  }

  return request(endpoint, options, retry)
}

async function request(endpoint, options, retry) {
  const url = `${API_BASE}${endpoint}`
  const method = (options.method || 'GET').toUpperCase()
  const isGetRequest = method === 'GET'
  const headers = {
    ...options.headers,
  }

  if (isJsonMethod(method) && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  if (isJsonMethod(method)) {
    headers['X-CSRFToken'] = await getCsrfToken()
  }

  const config = {
    cache: isGetRequest ? 'default' : 'no-store',
    ...options,
    method,
    headers,
    credentials: 'include',
  }

  const response = await fetch(url, config)
  const data = await parseBody(response)

  if (retry && isJsonMethod(method) && csrfFailed(data, response.status)) {
    csrfToken = ''
    return apiCall(endpoint, options, false)
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'An error occurred')
    error.status = response.status
    error.payload = data
    throw error
  }

  return data
}
