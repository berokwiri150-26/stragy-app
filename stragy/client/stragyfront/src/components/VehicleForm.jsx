export default function VehicleForm({ vehicleForm, onFieldChange, onSubmit, onClear }) {
  return (
    <form className="vehicle-form" onSubmit={onSubmit}>
      <h3>Add a Vehicle</h3>

      <label>
        Make
        <input
          value={vehicleForm.make}
          onChange={e => onFieldChange('make', e.target.value)}
          required
        />
      </label>

      <label>
        Model
        <input
          value={vehicleForm.model}
          onChange={e => onFieldChange('model', e.target.value)}
          required
        />
      </label>

      <label>
        Year
        <input
          type="number"
          value={vehicleForm.year}
          onChange={e => onFieldChange('year', e.target.value)}
        />
      </label>

      <label>
        Engine size
        <input
          value={vehicleForm.engine_size}
          onChange={e => onFieldChange('engine_size', e.target.value)}
        />
      </label>

      <label>
        Fuel type
        <input
          value={vehicleForm.fuel_type}
          onChange={e => onFieldChange('fuel_type', e.target.value)}
        />
      </label>

      <label>
        Tyre size
        <input
          value={vehicleForm.tyre_size}
          onChange={e => onFieldChange('tyre_size', e.target.value)}
        />
      </label>

      <label>
        Load capacity
        <input
          value={vehicleForm.load_capacity}
          onChange={e => onFieldChange('load_capacity', e.target.value)}
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="primary">Add Vehicle</button>
        <button type="button" onClick={onClear}>Clear</button>
      </div>
    </form>
  )
}
