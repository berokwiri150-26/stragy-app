"""Admin controller for StrAgy.

Port of the club/post app's admin blueprint, adapted to the StrAgy data
model (users, vehicles, trips, personal records and route notes):

    GET    /stats                 live counts for the main StrAgy entities
                                   (instead of Users/Clubs/Posts)
    GET    /users                 list & search users (User.to_dict instead of
                                   user_to_private_dict)
    GET    /vehicles              list vehicles (replaces the club listing -
                                   there are no clubs in StrAgy)
    DELETE /vehicles/<id>         delete a vehicle, cascading its trips,
                                   route notes and detaching its records
    GET    /moderation            the route-note review queue (StrAgy's
                                   user-generated content)
    DELETE /trips/<id>            delete a trip (replaces post deletion)
    DELETE /notes/<id>            delete a route note (drives the moderation
                                   queue)
    GET    /settings              system-wide defaults
    PUT    /settings              persist/echo system-wide settings

Removed because they do not map onto this app:
    * PATCH /users/<id>/role and PATCH /users/<id>/status - the User model
      has no is_superuser / is_banned columns.
    * JWT + superuser enforcement - no JWT manager or superuser roles are
      wired up in this app yet (see admin_endpoint / require_superuser).
"""

from functools import wraps

from flask import Blueprint, abort, jsonify, request

from app.models import (
    PersonalRecord,
    RouteNote,
    Trip,
    User,
    Vehicle,
)
from stragy.app.server.extensions import db


admin_bp = Blueprint("admin", __name__)


def get_or_404(model, record_id):
    """Return the record or abort with a 404 - local stand-in for the
    get_or_404 helper used by the original admin controller."""
    record = model.query.get(record_id)
    if record is None:
        abort(404, description=f"{model.__name__} with id {record_id} was not found")
    return record


def require_superuser():
    """Enforce superuser access for an admin endpoint.

    Placeholder for now: the app has no JWT manager initialised and the
    User model has no superuser/role field, so there is nothing to check
    yet. Hook real authorisation up here (e.g. flask_jwt_extended's
    jwt_required + a current_user.is_superuser check) once user roles
    land, mirroring the original admin controller.
    """


def admin_endpoint(function):
    """Require an admin/superuser session for the wrapped endpoint."""
    @wraps(function)
    def protected(*args, **kwargs):
        require_superuser()
        return function(*args, **kwargs)

    return protected


@admin_bp.get("/stats")
@admin_endpoint
def stats():
    return jsonify({
        "totalUsers": User.query.count(),
        "totalVehicles": Vehicle.query.count(),
        "totalTrips": Trip.query.count(),
        "totalPersonalRecords": PersonalRecord.query.count(),
        "totalRouteNotes": RouteNote.query.count(),
        "flaggedContent": 0,
        "systemStatus": "Healthy",
    })


@admin_bp.get("/users")
@admin_endpoint
def users():
    query = request.args.get("query", "").strip()
    user_query = User.query.order_by(User.username.asc())
    if query:
        user_query = user_query.filter(User.username.ilike(f"%{query}%"))
    return jsonify({"users": [user.to_dict() for user in user_query.all()]})


@admin_bp.get("/vehicles")
@admin_endpoint
def vehicles():
    vehicle_list = []
    for vehicle in Vehicle.query.order_by(Vehicle.make.asc(), Vehicle.model.asc()).all():
        item = vehicle.to_dict()
        item["owner"] = vehicle.user.username if vehicle.user else None
        item["trip_count"] = Trip.query.filter_by(vehicle_id=vehicle.id).count()
        vehicle_list.append(item)
    return jsonify({"vehicles": vehicle_list})


@admin_bp.delete("/vehicles/<int:vehicle_id>")
@admin_endpoint
def delete_vehicle(vehicle_id):
    vehicle = get_or_404(Vehicle, vehicle_id)

    trip_ids = [trip.id for trip in Trip.query.filter_by(vehicle_id=vehicle.id).all()]
    if trip_ids:
        # Detach any personal records that referenced one of the vehicle's
        # trips before removing the trips themselves.
        PersonalRecord.query.filter(PersonalRecord.trip_id.in_(trip_ids)).update(
            {"trip_id": None},
            synchronize_session=False,
        )
        RouteNote.query.filter(RouteNote.trip_id.in_(trip_ids)).delete(
            synchronize_session=False,
        )
        Trip.query.filter(Trip.id.in_(trip_ids)).delete(synchronize_session=False)

    # Detach personal records that referenced the vehicle directly.
    PersonalRecord.query.filter_by(vehicle_id=vehicle.id).update(
        {"vehicle_id": None},
        synchronize_session=False,
    )

    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({"message": "Vehicle deleted"})


@admin_bp.get("/moderation")
@admin_endpoint
def moderation():
    notes = RouteNote.query.order_by(RouteNote.created_at.desc()).limit(50).all()
    queue = []
    for note in notes:
        reporter = User.query.get(note.user_id) if note.user_id else None
        queue.append({
            "id": note.id,
            "type": "note",
            "content": note.content,
            "reportedBy": reporter.username if reporter else "unknown",
            "date": note.created_at.isoformat() if note.created_at else None,
        })
    return jsonify(queue)


@admin_bp.delete("/trips/<int:trip_id>")
@admin_endpoint
def delete_trip(trip_id):
    trip = get_or_404(Trip, trip_id)

    # Detach personal records that referenced the trip, then remove its
    # notes before deleting the trip itself.
    PersonalRecord.query.filter_by(trip_id=trip.id).update(
        {"trip_id": None},
        synchronize_session=False,
    )
    RouteNote.query.filter_by(trip_id=trip.id).delete(synchronize_session=False)

    db.session.delete(trip)
    db.session.commit()
    return jsonify({"message": "Trip deleted"})


@admin_bp.delete("/notes/<int:note_id>")
@admin_endpoint
def delete_note(note_id):
    note = get_or_404(RouteNote, note_id)
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Route note deleted"})


@admin_bp.get("/settings")
@admin_endpoint
def settings():
    return jsonify({
        "maintenanceMode": False,
        "allowNewSignups": True,
        "requireEmailVerification": True,
    })


@admin_bp.put("/settings")
@admin_endpoint
def update_settings():
    return jsonify(request.get_json(silent=True) or {})

