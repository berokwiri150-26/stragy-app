import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { TOKEN_KEY, USER_KEY } from '../Services/api'
import './Navbar.css'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Read current user session
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
      const token = localStorage.getItem(TOKEN_KEY)
      if (token && storedUser) {
        setUser(storedUser)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [location])

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    navigate('/login', { replace: true })
  }

  const initials = (name) => (name || 'U').slice(0, 2).toUpperCase()

  return (
    <header className="str-nav-header">
      <div className="str-nav-container">
        {/* Brand / Logo */}
        <Link to="/home" className="str-nav-brand">
          <span className="str-nav-brand-mark">S</span>
          <span className="str-nav-brand-text">
            STRAGY <span className="str-nav-brand-badge">PRO</span>
          </span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="str-nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="str-nav-hamburger"></span>
        </button>

        {/* Navigation Links */}
        <nav className={`str-nav-links ${mobileMenuOpen ? 'str-nav-links--open' : ''}`}>
          <NavLink
            to="/home"
            className={({ isActive }) => `str-nav-link ${isActive ? 'str-nav-link--active' : ''}`}
          >
            <span className="str-nav-icon">🚗</span>
            <span>Garage</span>
          </NavLink>

          <NavLink
            to="/discover"
            className={({ isActive }) => `str-nav-link ${isActive ? 'str-nav-link--active' : ''}`}
          >
            <span className="str-nav-icon">🧭</span>
            <span>Discover</span>
          </NavLink>

          <NavLink
            to="/records"
            className={({ isActive }) => `str-nav-link ${isActive ? 'str-nav-link--active' : ''}`}
          >
            <span className="str-nav-icon">⏱️</span>
            <span>Records</span>
          </NavLink>

          <NavLink
            to="/clans"
            className={({ isActive }) => `str-nav-link ${isActive ? 'str-nav-link--active' : ''}`}
          >
            <span className="str-nav-icon">🛡️</span>
            <span>Clans</span>
          </NavLink>

          {/* User / Auth section inside mobile or desktop */}
          <div className="str-nav-user-section">
            {user ? (
              <div className="str-nav-user-menu">
                {user.is_superuser && (
                  <Link to="/admin" className="str-nav-admin-chip">
                    Admin
                  </Link>
                )}
                <Link to="/settings" className="str-nav-profile-pill">
                  <span className="str-nav-avatar">{initials(user.username)}</span>
                  <span className="str-nav-username">@{user.username || 'User'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="str-nav-signout-btn"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="str-nav-auth-buttons">
                <Link to="/login" className="str-nav-btn str-nav-btn--secondary">
                  Log in
                </Link>
                <Link to="/signup" className="str-nav-btn str-nav-btn--primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
