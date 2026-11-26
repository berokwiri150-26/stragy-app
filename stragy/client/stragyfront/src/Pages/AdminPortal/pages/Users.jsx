import { useEffect, useState } from 'react'
import { getAdminUsers, toggleUserSuperuser, toggleUserBanStatus } from '../../../Services/Admin'
import { PageTitle, SearchInput, Loader, ErrorBanner, EmptyState, Toast } from './common'

const initials = (name) => (name || '?').slice(0, 2).toUpperCase()

export default function Users() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () =>
    getAdminUsers()
      .then(setRows)
      .catch((err) => setError(err.message || 'Could not load users'))

  useEffect(() => {
    load()
  }, [])

  const flash = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const toggleSuper = async (user) => {
    const next = !user.is_superuser
    setBusyId(user.id)
    try {
      await toggleUserSuperuser(user.id, next)
      setRows((prev) => prev.map((r) => (r.id === user.id ? { ...r, is_superuser: next } : r)))
      flash(next ? `@${user.username} promoted to superuser` : `@${user.username} demoted to member`)
    } catch (err) {
      flash(err.message || 'Could not update role')
    } finally {
      setBusyId(null)
    }
  }

  const toggleBan = async (user) => {
    const next = !user.is_banned
    setBusyId(user.id)
    try {
      await toggleUserBanStatus(user.id, next)
      setRows((prev) => prev.map((r) => (r.id === user.id ? { ...r, is_banned: next } : r)))
      flash(next ? `@${user.username} banned` : `@${user.username} unbanned`)
    } catch (err) {
      flash(err.message || 'Could not update status')
    } finally {
      setBusyId(null)
    }
  }

  if (error) {
    return (
      <div className="ap-page">
        <PageTitle title="Users" />
        <ErrorBanner message={error} />
      </div>
    )
  }

  if (!rows) {
    return (
      <div className="ap-page">
        <Loader />
      </div>
    )
  }

  const term = search.trim().toLowerCase()
  const filtered = rows.filter(
    (u) => !term || `${u.username} ${u.email || ''}`.toLowerCase().includes(term),
  )

  return (
    <div className="ap-page">
      <PageTitle title="Users" />
      <Toast message={toast} />
      <SearchInput value={search} onChange={setSearch} placeholder="Search users…" />

      {filtered.length === 0 ? (
        <EmptyState text="No users match your search." />
      ) : (
        <table className="ap-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Joined</th>
              <th>Superuser</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="ap-cell-user">
                  <span className="ap-avatar" aria-hidden="true">{initials(u.username)}</span>
                  <span className="ap-cell-user-text">
                    <strong>@{u.username}</strong>
                    {u.email && <small>{u.email}</small>}
                  </span>
                </td>
                <td className="ap-muted">{u.join_date ? new Date(u.join_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                <td>
                  <button type="button" className={`ap-toggle${u.is_superuser ? ' ap-toggle--on' : ''}`} disabled={busyId === u.id} onClick={() => toggleSuper(u)}>
                    {u.is_superuser ? 'Superuser' : 'Member'}
                  </button>
                </td>
                <td>
                  <button type="button" className="ap-toggle ap-toggle--danger" disabled={busyId === u.id} onClick={() => toggleBan(u)}>
                    {u.is_banned ? 'Banned' : 'Active'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

