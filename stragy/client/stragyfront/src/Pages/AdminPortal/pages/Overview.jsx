import { useEffect, useState } from 'react'
import { getAdminStats } from '../../../Services/Admin'
import { PageTitle, Loader, ErrorBanner, StatCard } from './common'

export default function Overview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getAdminStats()
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load stats')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="ap-page">
        <PageTitle title="Overview" />
        <ErrorBanner message={error} />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="ap-page">
        <Loader />
      </div>
    )
  }

  return (
    <div className="ap-page">
      <PageTitle title="Welcome back." desc="Here’s how StrAgy is doing right now." />

      <div className="ap-stats-grid">
        <StatCard label="Total users" value={stats.totalUsers} />
        <StatCard label="Active members" value={stats.activeMembers ?? stats.activeSMembers} tone="red" />
        <StatCard label="Clans" value={stats.totalClans} />
        <StatCard label="Posts" value={stats.totalPosts} />
        <StatCard label="Flagged content" value={stats.flaggedContent} tone="warn" />
        <StatCard label="System status" value={stats.systemStatus} />
      </div>

      <div className="ap-note">
        Showing simulated metrics for now — the real numbers appear once the admin API
        endpoints are live on the backend.
      </div>
    </div>
  )
}

