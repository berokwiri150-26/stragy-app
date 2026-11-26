import { useEffect, useState } from 'react'
import { getModerationQueue, deletePostAdmin } from '../../../Services/Admin'
import { PageTitle, Loader, ErrorBanner, EmptyState, Toast } from './common'

export default function Moderation() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () =>
    getModerationQueue()
      .then(setRows)
      .catch((err) => setError(err.message || 'Could not load the moderation queue'))

  useEffect(() => {
    load()
  }, [])

  const flash = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const action = async (item, postId) => {
    if (!window.confirm(`Remove this reported ${item.type}?`)) return
    setBusyId(item.id)
    try {
      await deletePostAdmin(postId)
      setRows((prev) => prev.filter((r) => r.id !== item.id))
      flash(`Reported ${item.type} removed`)
    } catch (err) {
      flash(err.message || 'Could not remove content')
    } finally {
      setBusyId(null)
    }
  }

  if (error) {
    return (
      <div className="ap-page">
        <PageTitle title="Moderation" />
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

  return (
    <div className="ap-page">
      <PageTitle title="Moderation" />
      <Toast message={toast} />

      {rows.length === 0 ? (
        <EmptyState text="The moderation queue is clear. Nice." />
      ) : (
        <ul className="ap-list">
          {rows.map((item) => (
            <li key={item.id} className="ap-list-item">
              <span className="ap-tag">{item.type}</span>
              <span className="ap-list-body">
                <strong>{item.content}</strong>
                <small>
                  reported by {item.reportedBy} · {item.date}
                </small>
              </span>
              <button type="button" className="ap-btn-danger" disabled={busyId === item.id} onClick={() => action(item, item.id)}>
                {busyId === item.id ? '…' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

