import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import api, { TOKEN_KEY, USER_KEY } from '../../Services/api'
import '../../Styles/global.css'

function readStoredUser() {
  try {
    const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    return u && typeof u === 'object' && u.id ? u : null
  } catch {
    return null
  }
}

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  // Already signed in? Straight to the portal.
  if (localStorage.getItem(TOKEN_KEY) && readStoredUser()) {
    return <Navigate to="/admin" replace />
  }

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError(null)
    setBusy(true)

    try {
      const { data } = await api.post('/api/auth/login', { username, password })
      if (!data || !data.token || !data.user) throw new Error('Unexpected server response')
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      navigate('/admin', { replace: true })
    } catch (err) {
      if (err?.status === 401 || err?.status === 400) {
        setError('Invalid username or password.')
      } else if (err?.isNetworkError) {
        setError('Cannot reach the server. Is the API running?')
      } else {
        setError(err?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card-wrap">
        <section className="auth-hero">
          <div className="auth-wordmark">
            <span className="auth-wordmark-mark" aria-hidden="true">S</span>
            <span className="auth-wordmark-text">STRAGY</span>
          </div>
          <h1>Your dash. Your data. Your build.</h1>
          <p className="auth-hero-text">
            Log trips, chase records, rally your clan — and keep every kilometre
            in black and red.
          </p>
          <ul className="auth-hero-points">
            <li>Log trips &amp; track records</li>
            <li>Discover &amp; join clans</li>
            <li>Follow the build, not the hype</li>
          </ul>
        </section>

        <section className="auth-panel">
          <p className="auth-eyebrow">Welcome back</p>
          <h2 className="auth-title">Sign in to continue.</h2>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={submit}>
            <label className="auth-field">
              <span>Username</span>
              <input
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="e.g. nightracer"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
          <p className="auth-switch">
            <Link to="/home">Browse the site first</Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default Login
