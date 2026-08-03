export default function RouteForm({
  routeForm,
  onFieldChange,
  onPhotoChange,
  photoPreview,
  onSubmit,
  onClear,
}) {
  return (
    <form className="route-form" onSubmit={onSubmit}>
      <h3>Log a Route</h3>
      <label>
        Title
        <input
          value={routeForm.title}
          onChange={e => onFieldChange('title', e.target.value)}
          required
        />
      </label>

      <label>
        Distance (km)
        <input
          type="number"
          step="0.1"
          value={routeForm.distance_km}
          onChange={e => onFieldChange('distance_km', e.target.value)}
        />
      </label>

      <label>
        Average speed (km/h)
        <input
          type="number"
          step="0.1"
          value={routeForm.avg_speed_kmh}
          onChange={e => onFieldChange('avg_speed_kmh', e.target.value)}
        />
      </label>

      <label>
        Notes
        <textarea
          value={routeForm.notes}
          onChange={e => onFieldChange('notes', e.target.value)}
        />
      </label>

      <label>
        Photo
        <input type="file" accept="image/*" onChange={onPhotoChange} />
      </label>

      {photoPreview && (
        <div className="photo-preview">
          <img src={photoPreview} alt="preview" />
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="primary">Post Route</button>
        <button type="button" onClick={onClear}>Clear</button>
      </div>
    </form>
  )
}
