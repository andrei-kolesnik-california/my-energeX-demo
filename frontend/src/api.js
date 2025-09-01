import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({ baseURL: API_BASE })

export function setAuth(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

/**
 * Try to turn an axios error into a human-readable message.
 */
export function parseApiError(err) {
  if (!err) return 'Unknown error'
  // Axios error with response
  if (err.response) {
    const { status, data } = err.response
    if (typeof data === 'string') return data
    // DRF validation errors: { field: [messages], non_field_errors: [...] }
    if (data && typeof data === 'object') {
      if (data.detail) return data.detail
      const parts = []
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) {
          parts.push(`${k}: ${v.join(', ')}`)
        } else if (typeof v === 'string') {
          parts.push(`${k}: ${v}`)
        }
      }
      if (parts.length) return parts.join(' • ')
    }
    // Generic by status
    if (status === 401) return 'Unauthorized: please log in'
    if (status === 403) return 'Forbidden'
    if (status === 404) return 'Not found'
    return `Request failed (${status})`
  }
  // Network or other
  if (err.message && /network/i.test(err.message)) return 'Network error. Check your connection.'
  return err.message || 'Unknown error'
}
