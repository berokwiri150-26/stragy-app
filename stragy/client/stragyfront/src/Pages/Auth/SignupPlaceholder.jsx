import { Link } from 'react-router-dom'

// Temporary stand-in until the real sign-up flow is built.
export default function SignupPlaceholder() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 40, letterSpacing: 2 }}>STRAGY</h1>
      <h2>Account creation is coming soon.</h2>
      <p>We’re setting up the sign-up flow — check back shortly.</p>
      <Link to="/login" style={{ color: '#ff1f1a', fontWeight: 700, textDecoration: 'none' }}>
        ← Back to login
      </Link>
    </section>
  )
}
