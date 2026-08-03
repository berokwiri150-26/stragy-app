export default function VehicleItem({ vehicle, selected, onSelect }) {
  return (
    <div
      className={`vehicle-item ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(vehicle.id)}
    >
      <div className="vehicle-main">
        <strong>{vehicle.make} {vehicle.model}</strong>
        <small>{vehicle.year}</small>
      </div>
      <div className="vehicle-meta">{vehicle.license_plate}</div>
    </div>
  )
}
