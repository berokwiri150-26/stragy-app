import { useState } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { TOKEN_KEY, USER_KEY } from '../../Services/api'
import './aportal.css'

const initials = (name) => (name || 'AD').slice(0, 2).toUpperCase()

// ------------------------------ Nav icons -------------------------------

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
)

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
)

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
)

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16a1 1 0 0 1 1 2h4a1 1 0 0 1 0 4h-4a1 1 0 0 1 1-2h-16a1 1 0 0 1-1 2h4a1 1 0 0 1 0-4h-4a1 1 0 0 1-1 2" /><path d="M20 3h2a2 2 0 0 1-1 1h-1a2 2 0 0 1-1-1h2v2h-13a2.5 2.5 0 0 1 13 0v-2h-1a2 2 0 0 1-1 1h4a2 2 0 0 1 2 2v34" /></svg>
)

const NAV = [
  { to: '/admin', label: 'Overview', icon: DashboardIcon, end: true },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/clans', label: 'Clans', icon: ShieldIcon },
  { to: '/admin/moderation', label: 'Moderation', icon: MessageIcon },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
]

const PAGE_TITLES = {
  '/admin': { title: 'Overview', sub: 'Platform at a glance' },
  '/admin/users': { title: 'Users', sub: 'Manage accounts, roles and bans' },
  '/admin/clans': { title: 'Clans', sub: 'Manage clans and membership' },
  '/admin/moderation': { title: 'Moderation', sub: 'Review reported content' },
  '/admin/settings': { title: 'Settings', sub: 'System-wide preferences' },
}

function readUser() {
  try {
    const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    return u && typeof u === 'object' ? u : null
  } catch {
    return null
  }
}

function AdminPortal() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(readUser)

  const meta = PAGE_TITLES[location.pathname] || { title: 'Admin', sub: '' }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <div className="ap-root">
      <aside className="ap-sidebar">
        <Link to="/admin" className="ap-brand">
          <span className="ap-brand-mark">S</span>
          <span className="ap-brand-name">STRAGY <em>ADMIN</em></span>
        </Link>

        <nav className="ap-nav" aria-label="Admin sections">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `ap-nav-link${isActive ? ' ap-nav-link--active' : ''}`}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ap-sidebar-foot">
          <Link to="/home" className="ap-nav-link ap-nav-link--plain">View site →</Link>
        </div>
      </aside>

      <main className="ap-main">
        <header className="ap-topbar">
          <div className="ap-pagehead">
            <h1>{meta.title}</h1>
            <p>{meta.sub}</p>
          </div>
          <div className="ap-userbox">
            <span className="ap-avatar" aria-hidden="true">{initials(user?.username)}</span>
            <span className="ap-usertext">
              <strong>{user?.username || 'Admin'}</strong>
              <small>Administrator</small>
            </span>
            <button type="button" className="ap-signout" onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>

        <div className="ap-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminPortal
