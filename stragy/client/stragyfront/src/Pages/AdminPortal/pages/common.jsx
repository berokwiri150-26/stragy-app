// Shared building blocks for the admin portal pages.

export function PageTitle({ title, desc }) {
  return (
    <div className="ap-pagehead-inline">
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <label className="ap-search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}

export function Loader() {
  return <div className="ap-loading">Loading…</div>
}

export function ErrorBanner({ message }) {
  return <div className="ap-error" role="alert">{message}</div>
}

export function EmptyState({ text }) {
  return <div className="ap-empty">{text}</div>
}

export function StatCard({ label, value, tone = '' }) {
  return (
    <div className={`ap-stat${tone ? ` ap-stat--${tone}` : ''}`}>
      <span className="ap-stat-value">{value == null ? '—' : value}</span>
      <span className="ap-stat-label">{label}</span>
    </div>
  )
}

export function Toast({ message }) {
  if (!message) return null
  return <div className="ap-toast" role="status">{message}</div>
}

