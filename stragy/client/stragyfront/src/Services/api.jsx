// Services/api.jsx
// -----------------------------------------------------------------------------
// Central HTTP client for the StrAgy frontend.
//
// Responsibilities:
//   - Session keys: the token + user entries used to authenticate requests
//   - API base URL: VITE_API_BASE in production, empty string in dev
//     (Vite dev server proxies /api -> http://127.0.0.1:5000)
//   - Interceptors: request chain (attach auth header) + response chain
//     (parse JSON, normalize errors)
//
// The surface intentionally mirrors axios, so call sites can use the same
// shape the rest of the app expects:
//   api.get(url, { params })  ->  { data, status }
//   api.post(url, body, { params })
//   api.patch(url, body)
//   api.put(url, body)
//   api.delete(url, { params })
// -----------------------------------------------------------------------------

export const TOKEN_KEY = 'stragy_token'
export const USER_KEY = 'stragy_user'

export const API_BASE =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE
    ? import.meta.env.VITE_API_BASE
    : ''

const JSON_HEADERS = { 'Content-Type': 'application/json' }

// --------------------------- Interceptor registry ---------------------------
// Lightweight axios-style interceptors implemented over fetch.
//   api.interceptors.request.use(fn)   -> fn(options) may mutate options
//   api.interceptors.response.use(fn)  -> fn({ data, status })
//   api.interceptors.response.error(fn)-> fn(error)
// Each returns an unregister function.

const requestInterceptors = []
const responseInterceptors = []
const errorInterceptors = []

const register = (list) => (fn) => {
  list.push(fn)
  return () => {
    const index = list.indexOf(fn)
    if (index >= 0) list.splice(index, 1)
  }
}

export const interceptors = {
  request: { use: register(requestInterceptors) },
  response: { use: register(responseInterceptors), error: register(errorInterceptors) },
}

// ------------------------------ URL building --------------------------------

function buildUrl(path, params) {
  const base =
    typeof path === 'string' && /^https?:\/\//.test(path) ? path : `${API_BASE}${path}`
  if (!params) return base
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.append(key, value)
  })
  const query = qs.toString()
  return query ? `${base}${base.includes('?') ? '&' : '?'}${query}` : base
}

// ------------------------------ Request core --------------------------------

async function request(path, options = {}) {
  const { method = 'GET', body, params, headers = {} } = options

  const finalOptions = {
    method,
    headers: { ...JSON_HEADERS, ...headers },
  }

  // Default auth interceptor: attach session token when present.
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) finalOptions.headers['Authorization'] = `Bearer ${token}`

  // Custom request interceptors may mutate finalOptions.
  for (const fn of requestInterceptors) fn(finalOptions, path)

  if (body !== undefined) {
    finalOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(buildUrl(path, params), finalOptions)
  } catch (err) {
    const networkError = new Error('Network error: could not reach the API server.')
    networkError.name = 'NetworkError'
    networkError.isNetworkError = true
    networkError.cause = err
    for (const fn of errorInterceptors) fn(networkError)
    throw networkError
  }

  const text = await response.text().catch(() => '')
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  const result = { data, status: response.status }
  for (const fn of responseInterceptors) fn(result, response)

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) || `Request failed with status ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.data = data
    for (const fn of errorInterceptors) fn(error, response)
    throw error
  }

  return result
}

// ------------------------------ Public API ---------------------------------

export const api = {
  get: (url, config) => request(url, { ...config, method: 'GET' }),
  post: (url, body, config) => request(url, { ...config, method: 'POST', body }),
  patch: (url, body, config) => request(url, { ...config, method: 'PATCH', body }),
  put: (url, body, config) => request(url, { ...config, method: 'PUT', body }),
  delete: (url, config) => request(url, { ...config, method: 'DELETE' }),
}

export default api
