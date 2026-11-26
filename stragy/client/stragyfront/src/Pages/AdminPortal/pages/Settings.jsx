import { useEffect, useState } from 'react'
import { getSystemSettings, updateSystemSettings } from '../../../Services/Admin'
import { PageTitle, Loader, ErrorBanner, Toast } from './common'

export default function Settings() {
  const [settings, setSettings] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let cancelled = false
    getSystemSettings()
      .then((data) => {
        if (!cancelled) setSettings(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load settings')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await updateSystemSettings(settings)
      setToast('Settings saved')
    } catch (err) {
      setToast(err.message || 'Could not save settings')
    } finally {
      setSaving(false)
      window.setTimeout(() => setToast(null), 2600)
    }
  }

  if (error) {
    return (
      <div className="ap-page">
        <PageTitle title="Settings" />
        <ErrorBanner message={error} />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="ap-page">
        <Loader />
      </div>
    )
  }

  return (
    <div className="ap-page">
      <PageTitle title="Settings" />
      <Toast message={toast} />

      <div className="ap-settings-grid">
        <label className="ap-setting">
          <span className="ap-setting-text">
            <strong>Maintenance mode</strong>
            <small>Block sign-ins and show a maintenance notice</small>
          </span>
          <input type="checkbox" checked={!!settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
        </label>

        <label className="ap-setting">
          <span className="ap-setting-text">
            <strong>Allow new signups</strong>
            <small>Permit new accounts on the platform</small>
          </span>
          <input type="checkbox" checked={!!settings.allowNewSignups} onChange={(e) => setSettings({ ...settings, allowNewSignups: e.target.checked })} />
        </label>

        <label className="ap-setting">
          <span className="ap-setting-text">
            <strong>Require email verification</strong>
            <small>New accounts must confirm their email</small>
          </span>
          <input type="checkbox" checked={!!settings.requireEmailVerification} onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })} />
        </label>

        <label className="ap-setting">
          <span className="ap-setting-text">
            <strong>Max clans per user</strong>
            <small>Cap how many clans a member can join</small>
          </span>
          <input type="number" min="1" max="20" value={settings.maxClansPerUser ?? settings.maxClubsPerUser ?? 5} onChange={(e) => {
            const next = Number(e.target.value)
            setSettings({ ...settings, maxClansPerUser: next, maxClubsPerUser: next })
          }} />
        </label>
      </div>

      <button type="button" className="ap-btn-primary" disabled={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}

