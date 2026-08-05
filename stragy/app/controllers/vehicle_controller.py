from app.models.vehicle import Vehicle
from server.extensions import db


def _parse_int(value):
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def create_vehicle(data):
    vehicle = Vehicle(
        user_id=_parse_int(data.get("user_id")),
        make=data.get("make"),
        model=data.get("model"),
        year=_parse_int(data.get("year")),
        engine_size=data.get("engine_size"),
        fuel_type=data.get("fuel_type"),
        tyre_size=data.get("tyre_size"),
        load_capacity=data.get("load_capacity"),
    )
    db.session.add(vehicle)
    db.session.commit()
    return vehicle


def list_vehicles():
    return Vehicle.query.all()
