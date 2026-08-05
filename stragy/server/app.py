import os
import sys

from flask import Flask, jsonify, request
from flask_migrate import Migrate

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from server.config import Config
from server.extensions import db

import app.models
from app.controllers.user_controller import create_user, list_users
from app.controllers.vehicle_controller import create_vehicle, list_vehicles
from app.controllers.vehicle_catalog_controller import search_vehicle_catalog
from app.controllers.trip_controller import (
    add_trip_note,
    create_trip,
    get_trip_notes,
    list_trips,
)
from app.controllers.personal_record_controller import (
    create_personal_record,
    list_personal_records,
)
from app.models.user import User


def create_app(config_object=Config):
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(config_object)

    register_extensions(app)
    register_routes(app)

    return app


def register_extensions(app):
    db.init_app(app)
    Migrate(app, db)
    return app


def register_routes(app):
    @app.get("/health")
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "app": "StrAgy API"})

    @app.get("/users")
    @app.get("/api/users")
    def users():
        return jsonify([user.to_dict() for user in list_users()])

    @app.post("/users")
    @app.post("/api/users")
    def new_user():
        payload = request.get_json(silent=True) or {}
        user = create_user(payload)
        return jsonify(user.to_dict()), 201
# This section here connects the backend to front end, so that the app is somewhat ready to deploy. SOme routes just for better alignment.
    @app.get("/api/users/vehicles")
    def users_vehicles():
        return jsonify([vehicle.to_dict() for vehicle in list_vehicles()])

    @app.get("/api/vehicle-search")
    def vehicle_search():
        query = request.args.get("query", "")
        results = search_vehicle_catalog(query)

        serialized = []
        for item in results:
            if hasattr(item, "to_dict"):
                serialized.append(item.to_dict())
            else:
                serialized.append(item)
        return jsonify(serialized)

    @app.post("/api/auth/login")
    def login():
        payload = request.get_json(silent=True) or {}
        username = payload.get("username")
        password = payload.get("password")

        if not username or not password:
            return jsonify({"error": "username and password are required"}), 400

        user = User.query.filter_by(username=username).first()
        if user:
            if user.password_hash != password:
                return jsonify({"error": "invalid credentials"}), 401
        else:
            user = create_user({"username": username, "password": password})

        return jsonify({"user": user.to_dict(), "token": f"token-{user.id}-{user.username}"})

    @app.get("/vehicles")
    @app.get("/api/vehicles")
    def vehicles():
        return jsonify([vehicle.to_dict() for vehicle in list_vehicles()])

    @app.post("/vehicles")
    @app.post("/api/vehicles")
    def new_vehicle():
        payload = request.get_json(silent=True) or {}
        vehicle = create_vehicle(payload)
        return jsonify(vehicle.to_dict()), 201

    @app.get("/routes")
    @app.get("/api/routes")
    def routes():
        return jsonify([trip.to_dict() for trip in list_trips()])

    @app.post("/routes")
    @app.post("/api/routes")
    def new_route():
        if request.is_json:
            payload = request.get_json(silent=True) or {}
        else:
            payload = {**request.form.to_dict()}
            if request.files.get("photo"):
                payload["photo"] = request.files["photo"]

        trip = create_trip(payload)
        return jsonify(trip.to_dict()), 201

    @app.get("/routes/<int:route_id>/notes")
    @app.get("/api/routes/<int:route_id>/notes")
    def route_notes(route_id):
        notes = get_trip_notes(route_id)
        return jsonify([note.to_dict() for note in notes])

    @app.post("/routes/<int:route_id>/notes")
    @app.post("/api/routes/<int:route_id>/notes")
    def add_note(route_id):
        payload = request.get_json(silent=True) or {}
        note = add_trip_note(route_id, payload)
        return jsonify(note.to_dict()), 201

    @app.get("/personal-records")
    @app.get("/api/personal-records")
    def records():
        return jsonify([record.to_dict() for record in list_personal_records()])

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
