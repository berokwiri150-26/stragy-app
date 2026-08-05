from datetime import datetime

from app.models.route_note import RouteNote
from app.models.trip import Trip
from server.extensions import db


def _parse_float(value):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _parse_int(value):
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def create_trip(data):
    trip = Trip(
        vehicle_id=_parse_int(data.get("vehicle_id")),
        start_time=data.get("start_time"),
        end_time=data.get("end_time"),
        start_location=data.get("start_location"),
        end_location=data.get("end_location"),
        distance=_parse_float(data.get("distance")),
        avg_speed=_parse_float(data.get("avg_speed")),
        top_speed=_parse_float(data.get("top_speed")),
        fuel_used=_parse_float(data.get("fuel_used")),
        route_type=data.get("route_type"),
        created_at=data.get("created_at") or datetime.utcnow(),
    )
    db.session.add(trip)
    db.session.commit()
    return trip


def list_trips():
    return Trip.query.all()


def get_trip_notes(route_id):
    trip = Trip.query.get(route_id)
    return trip.notes if trip else []


def add_trip_note(route_id, data):
    trip = Trip.query.get(route_id)
    if not trip:
        raise ValueError("Trip not found")

    note = RouteNote(
        trip_id=route_id,
        user_id=data.get("user_id"),
        content=data.get("content"),
        created_at=data.get("created_at"),
    )
    db.session.add(note)
    db.session.commit()
    return note
