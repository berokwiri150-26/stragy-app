import VehicleItem from './VehicleItem'

export default function VehicleList({ vehicles, selectedVehicleId, query, onSelectVehicle }) {
  const filtered = vehicles.filter(v =>
    v.make?.toLowerCase().includes(query.toLowerCase()) ||
    v.model?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section className="vehicles-list">
      <h2>Your Vehicles</h2>
      <div className="vehicle-items">
        {filtered.length === 0 && (
          <p className="muted">
            {query.trim()
              ? `No vehicles match "${query}". Try a different term or add a vehicle.`
              : 'No vehicles found. Add a vehicle, or search for a different kind.'}
          </p>
        )}
        {filtered.map(v => (
          <VehicleItem
            key={v.id}
            vehicle={v}
            selected={String(selectedVehicleId) === String(v.id)}
            onSelect={onSelectVehicle}
          />
        ))}
      </div>
    </section>
  )
}
