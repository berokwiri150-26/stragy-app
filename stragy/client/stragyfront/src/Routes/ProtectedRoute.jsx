import { Navigate } from 'react-router-dom'
import { TOKEN_KEY, USER_KEY } from '../Services/api'

// Session guard for admin-only routes.
// Renders the wrapped pages when a session exists, otherwise bounces to /login.
// NOTE: this checks for a signed-in session. Role-based gating
// (user.role === 'admin') will be layered on once the backend exposes a role field.
function isSignedIn() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    return Boolean(token) && Boolean(user && typeof user === 'object' && user.id)
  } catch {
    return false
  }
}

export default function ProtectedRoute({ children }) {
  if (!isSignedIn()) return <Navigate to="/login" replace />
  return children
}
