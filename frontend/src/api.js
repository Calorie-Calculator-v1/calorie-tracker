// Resolves base URL dynamically across Vite or Create React App, with clean trailing-slash removal
const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL
  }
  return '/api/v1.0'
}

const BASE = getBaseUrl().replace(/\/$/, '')

export async function request(path, { body, ...options } = {}) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Cannot reach the server. Check that the backend is running and try again.', { cause: error })
  }

  const text = await response.text()
  const type = response.headers.get('content-type') || ''

  if (response.status === 401 || response.status === 403 || response.redirected || type.includes('text/html')) {
    const error = new Error(
        path === '/login'
            ? 'Sign-in failed. Check your email and password, and verify your account first.'
            : 'Please sign in to continue.'
    )
    error.status = 401
    throw error
  }

  let data = text
  if (type.includes('application/json') && text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    let message =
        response.status >= 500
            ? 'The server could not complete this request. Check the backend connection and try again.'
            : typeof data === 'string'
                ? data
                : data.message || Object.values(data).filter((v) => typeof v === 'string').join('. ')

    if (path === '/login') {
      message = 'Sign-in failed. Check your email and password, and verify your account first.'
    }

    const error = new Error(message || `Request failed (${response.status}). Please try again.`)
    error.status = response.status
    throw error
  }

  return data
}

export const api = {
  async me() {
    const data = await request('/me')
    if (data && typeof data === 'object') return { name: data.name, email: data.email }
    const text = String(data).trim()
    const match = text.match(/^Logged in as: (.*) \((.*)\)$/) || text.match(/^Current User: (.*), Email: (.*)$/)
    if (!match) throw new Error(`Unexpected /me response: ${text}`)
    return { name: match[1], email: match[2] }
  },
  login: (body) => request('/login', { method: 'POST', body }),
  register: (body) => request('/register', { method: 'POST', body }),
  logout: () => request('/logout', { method: 'POST' }),
  search: (query, signal) => request(`/foods/search?q=${encodeURIComponent(query)}`, { signal }),
  meals: (date, signal) => request(`/me/foodlog?date=${encodeURIComponent(date)}`, { signal }),
  summary: (signal) => request('/me/foodlog/summary', { signal }),
  history: (signal) => request('/me/foodlog/history', { signal }),
  addMeal: (body) => request('/me/foodlog', { method: 'POST', body }),
  deleteMeal: (id) => request(`/me/foodlog/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function number(value, digits = 0) {
  return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: digits })
}

export function weekDays(history, now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - 6 + i)
    const key = localDate(date)
    return history.find((day) => day.date === key) || { date: key, totalCalories: 0 }
  })
}