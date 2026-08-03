export default function UnsentQueue({ unsentCount, onRetry }) {
  return (
    <div className="unsent-queue">
      <button type="button" onClick={onRetry} disabled={unsentCount === 0}>
        Retry unsent ({unsentCount})
      </button>
    </div>
  )
}
