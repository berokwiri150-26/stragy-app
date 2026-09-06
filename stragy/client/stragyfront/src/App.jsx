import './App.css'
import { useState, useEffect } from 'react'
import AuthPortal from './components/AuthPortal'
import SearchBar from './components/SearchBar'
import VehicleForm from './components/VehicleForm'
import VehicleList from './components/VehicleList'
import RouteForm from './components/RouteForm'
import UnsentQueue from './components/UnsentQueue'

function App() {
  // In production set VITE_API_BASE to your backend URL (example: https://api.example.com)
  // Leave empty for local dev where Vite proxies /api to backend.
  const API_BASE = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE
    ? import.meta.env.VITE_API_BASE
    : ''
  const [vehicles, setVehicles] = useState([])
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('stragy_user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('stragy_token') || '')
  const [query, setQuery] = useState('')
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    engine_size: '',
    fuel_type: '',
    tyre_size: '',
    load_capacity: '',
  })
  const [routeForm, setRouteForm] = useState({ title: '', distance_km: '', avg_speed_kmh: '', notes: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [unsent, setUnsent] = useState(() => JSON.parse(localStorage.getItem('unsent_routes') || '[]'))

  useEffect(() => {
    localStorage.setItem('unsent_routes', JSON.stringify(unsent || []))
  }, [unsent])

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchVehicles(query)
      } else {
        fetchVehicles()
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  async function fetchVehicles() {
    try {
      const res = await fetchWithAuth('/api/users/vehicles')
      if (!res.ok) throw new Error('fetch error')
      const data = await res.json()
      setVehicles(data || [])
    } catch (e) {
      console.warn('could not fetch vehicles', e)
    }
  }

  async function searchVehicles(searchTerm) {
    try {
      const res = await fetchWithAuth(`/api/vehicle-search?query=${encodeURIComponent(searchTerm)}`)
      if (!res.ok) throw new Error('search failed')
      const data = await res.json()
      setVehicles(data || [])
    } catch (e) {
      console.warn('could not search vehicles', e)
    }
  }

  async function createVehicle(payload) {
    if (!user?.id) {
      throw new Error('You must be logged in to add a vehicle')
    }

    const res = await fetchWithAuth('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, user_id: user.id }),
    })

    if (!res.ok) {
      // Try to parse server-provided error message for better feedback
      let errMsg = `vehicle creation failed (${res.status})`
      try {
        const body = await res.json()
        if (body) {
          if (body.error) errMsg = body.error
          else if (body.message) errMsg = body.message
          else if (typeof body === 'string') errMsg = body
        }
      } catch (e) {
        // ignore JSON parse errors
      }
      throw new Error(errMsg)
    }

    const vehicle = await res.json()
    setVehicles(prev => [vehicle, ...prev])
    return vehicle
  }

  function fetchWithAuth(url, opts = {}) {
    const headers = opts.headers ? { ...opts.headers } : {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    // Prefix URL with API_BASE when present (production). Keeps relative paths for dev.
    const fullUrl = url.startsWith('http') || url.startsWith(API_BASE)
      ? url
      : `${API_BASE}${url}`
    return fetch(fullUrl, { ...opts, headers })
  }

  async function login(username, password) {
    try {
      const res = await fetchWithAuth('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error('auth failed')
      const data = await res.json()
      setToken(data.token)
      setUser(data.user || { username })
      localStorage.setItem('stragy_token', data.token)
      localStorage.setItem('stragy_user', JSON.stringify(data.user || { username }))
      return true
    } catch (err) {
      console.error('login failed', err)
      
      setUser(null)
      setToken('')
      localStorage.removeItem('stragy_user')
      localStorage.removeItem('stragy_token')
      return false
    }
  }

  function logout() {
    setUser(null)
    setToken('')
    localStorage.removeItem('stragy_user')
    localStorage.removeItem('stragy_token')
  }

  function onSearchChange(e) {
    setQuery(e.target.value)
  }

  function onSelectVehicle(vehicleId) {
    setSelectedVehicleId(String(vehicleId))
  }

  function onVehicleFieldChange(key, value) {
    setVehicleForm(prev => ({ ...prev, [key]: value }))
  }

  function onRouteFieldChange(key, value) {
    setRouteForm(prev => ({ ...prev, [key]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0] || null
    setPhoto(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  function handleClearRoute() {
    setRouteForm({ title: '', distance_km: '', avg_speed_kmh: '', notes: '' })
    setPhoto(null)
    setPhotoPreview(null)
  }

  function handleClearVehicle() {
    setVehicleForm({
      make: '',
      model: '',
      year: '',
      engine_size: '',
      fuel_type: '',
      tyre_size: '',
      load_capacity: '',
    })
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.onerror = reject
      fr.readAsDataURL(file)
    })
  }

  function dataURLToBlob(dataurl) {
    const parts = dataurl.split(',')
    const mime = parts[0].match(/:(.*?);/)[1]
    const bstr = atob(parts[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    return new Blob([u8arr], { type: mime })
  }

  async function submitRoute(e) {
    e.preventDefault()
    if (!selectedVehicleId) {
      alert('Choose a vehicle first')
      return
    }

    const payload = { vehicle_id: selectedVehicleId, ...routeForm }
    try {
      const formData = new FormData()
      formData.append('vehicle_id', selectedVehicleId)
      Object.entries(routeForm).forEach(([k, v]) => formData.append(k, String(v)))
      if (photo) formData.append('photo', photo)

      const res = await fetchWithAuth('/api/routes', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('submit failed')
      alert('Route posted')
      handleClearRoute()
    } catch (err) {
      console.error('post failed, saving locally', err)
      if (photo) {
        try {
          const dataUrl = await readFileAsDataURL(photo)
          setUnsent(prev => [{ payload, photoDataUrl: dataUrl, ts: Date.now() }, ...prev])
        } catch (err2) {
          console.error('could not read photo', err2)
          setUnsent(prev => [{ payload, photoDataUrl: null, ts: Date.now() }, ...prev])
        }
      } else {
        setUnsent(prev => [{ payload, photoDataUrl: null, ts: Date.now() }, ...prev])
      }
      alert('Saved locally — will retry when online or when you press Retry')
    }
  }

  async function retryUnsent() {
    if (!unsent || unsent.length === 0) return
    const remaining = []
    for (const item of unsent) {
      try {
        const fd = new FormData()
        fd.append('vehicle_id', item.payload.vehicle_id)
        Object.entries(item.payload).forEach(([k, v]) => {
          if (k !== 'vehicle_id') fd.append(k, String(v))
        })
        if (item.photoDataUrl) fd.append('photo', dataURLToBlob(item.photoDataUrl), 'photo.jpg')
        const res = await fetchWithAuth('/api/routes', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('server refused')
      } catch (err) {
        console.warn('retry failed for item', item, err)
        remaining.push(item)
      }
    }
    setUnsent(remaining)
    if (remaining.length === 0) alert('All unsent routes synced')
    else alert(`${remaining.length} routes remain unsent`)
  }

  async function submitVehicle(e) {
    e.preventDefault()
    try {
      const vehicle = await createVehicle(vehicleForm)
      setSelectedVehicleId(vehicle.id)
      handleClearVehicle()
      alert('Vehicle added successfully')
    } catch (err) {
      console.error('could not add vehicle', err)
      const msg = err?.message || ''
      if (msg.toLowerCase().includes('logged in') || msg.toLowerCase().includes('login')) {
        alert('Please sign in to add a vehicle.')
      } else {
        alert(`Could not add vehicle: ${msg}`)
      }
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">StrAgy</p>
          <h1>Track vehicles, routes and route notes</h1>
          <p className="intro">
            A space for car enthusiasts to log vehicles, post routes, and share notes.
          </p>
        </div>
        <AuthPortal user={user} onLogin={login} onLogout={logout} />
      </header>

      <SearchBar query={query} onQueryChange={onSearchChange} onRefresh={fetchVehicles} />

      <VehicleForm
        vehicleForm={vehicleForm}
        onFieldChange={onVehicleFieldChange}
        onSubmit={submitVehicle}
        onClear={handleClearVehicle}
      />

      <VehicleList
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        query={query}
        onSelectVehicle={onSelectVehicle}
      />

      <section className="form-row">
        <RouteForm
          routeForm={routeForm}
          onFieldChange={onRouteFieldChange}
          onPhotoChange={handlePhotoChange}
          photoPreview={photoPreview}
          onSubmit={submitRoute}
          onClear={handleClearRoute}
        />
        <UnsentQueue unsentCount={unsent?.length || 0} onRetry={retryUnsent} />
      </section>

      <section className="callout">
        <h2>Ready for your next drive?</h2>
        <p>
          Search your trip and trip details you need, or alternatively,
          log your routes and share your experiences with the StrAgy community.
        </p>
      </section>
    </div>
  )
}

export default App
