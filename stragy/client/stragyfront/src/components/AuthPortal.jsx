import { useState } from 'react'

export default function AuthPortal({ user, onLogin, onLogout }) {
  return (
    <div className="auth-portal">
      {user ? (
        <div className="user-box">
          <span className="username">{user.username}</span>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <LoginForm onLogin={onLogin} />
      )}
    </div>
  )
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await onLogin(username, password)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <input
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" disabled={busy}>Sign in</button>
    </form>
  )
}
