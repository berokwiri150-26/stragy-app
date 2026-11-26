import { useEffect, useState } from 'react'
import { getAdminClans, deleteClanAdmin } from '../../../Services/Admin'
import { PageTitle, SearchInput, Loader, ErrorBanner, EmptyState, Toast } from './common'

const initials = (name) => (name || '?').slice(0, 2).toUpperCase()

export default function Clans() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () =>
    getAdminClans()
      .then(setRows)
      .catch((err) => setError(err.message || 'Could not load clans'))

  useEffect(() => {
    load()
  }, [])

  const flash = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const remove = async (clan) => {
    if (!window.confirm(`Delete the ${clan.name} clan? This cannot be undone.`)) return
    setBusyId(clan.id)
    try {
      await deleteClanAdmin(clan.id)
      setRows((prev) => prev.filter((c) => c.id !== clan.id))
      flash(`${clan.name} deleted`)
    } catch (err) {
      flash(err.message || 'Could not delete clan')
    } finally {
      setBusyId(null)
    }
  }

  if (error) {
    return (
      <div className="ap-page">
        <PageTitle title="Clans" />
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
  const filtered = rows.filter((c) => !term || `${c.name} ${c.description || ''}`.toLowerCase().includes(term))

  return (
    <div className="ap-page">
      <PageTitle title="Clans" />
      <Toast message={toast} />
      <SearchInput value={search} onChange={setSearch} placeholder="Search clans…" />

      {filtered.length === 0 ? (
        <EmptyState text="No clans match your search." />
      ) : (
        <table className="ap-table">
          <thead>
            <tr>
              <th>Clan</th>
              <th>Owner</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="ap-cell-user">
                  <span className="ap-avatar" aria-hidden="true">{initials(c.name)}</span>
                  <span className="ap-cell-user-text">
                    <strong>{c.name}</strong>
                    {c.description && <small>{c.description}</small>}
                  </span>
                </td>
                <td className="ap-muted">{(c.owner && `@${c.owner}`) || (c.created_by && `@${c.created_by}`) || '—'}</td>
                <td className="ap-muted">{c.member_count ?? c.members ?? '—'}</td>
                <td>
                  <button type="button" className="ap-btn-danger" disabled={busyId === c.id} onClick={() => remove(c)}>
                    {busyId === c.id ? '…' : 'Delete'}
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

