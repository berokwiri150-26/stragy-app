from flask import Flask, jsonify, request
from flask_migrate import Migrate

from server.config import Config
from server.extensions import db

# Temporary in-memory storage for MVP demo purposes.
# These will later be replaced by real database models.
vehicle_store = []
route_store = []
note_store = []


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
    def health():
        return jsonify({"status": "ok", "app": "StrAgy API"})

    @app.get("/vehicles")
    def get_vehicles():
        return jsonify(vehicle_store)

    @app.post("/vehicles")
    def create_vehicle():
        payload = request.get_json(silent=True) or {}
        vehicle_id = len(vehicle_store) + 1
        vehicle = {
            "id": vehicle_id,
            "user_id": payload.get("user_id"),
            "make": payload.get("make"),
            "model": payload.get("model"),
            "year": payload.get("year"),
            "engine_size": payload.get("engine_size"),
            "fuel_type": payload.get("fuel_type"),
            "tyre_size": payload.get("tyre_size"),
            "load_capacity": payload.get("load_capacity"),
            "created_at": payload.get("created_at"),
        }
        vehicle_store.append(vehicle)
        return jsonify(vehicle), 201

    @app.get("/routes")
    def get_routes():
        return jsonify(route_store)

    @app.post("/routes")
    def create_route():
        payload = request.get_json(silent=True) or {}
        route_id = len(route_store) + 1
        route = {
            "id": route_id,
            "user_id": payload.get("user_id"),
            "vehicle_id": payload.get("vehicle_id"),
            "start_location": payload.get("start_location"),
            "end_location": payload.get("end_location"),
            "distance": payload.get("distance"),
            "avg_speed": payload.get("avg_speed"),
            "top_speed": payload.get("top_speed"),
            "route_type": payload.get("route_type"),
            "notes": [],
            "created_at": payload.get("created_at"),
        }
        route_store.append(route)
        return jsonify(route), 201

    @app.get("/routes/<int:route_id>/notes")
    def get_route_notes(route_id):
        route = next((r for r in route_store if r["id"] == route_id), None)
        if not route:
            return jsonify({"error": "Route not found"}), 404
        return jsonify(route.get("notes", []))

    @app.post("/routes/<int:route_id>/notes")
    def create_route_note(route_id):
        route = next((r for r in route_store if r["id"] == route_id), None)
        if not route:
            return jsonify({"error": "Route not found"}), 404

        payload = request.get_json(silent=True) or {}
        note_id = len(note_store) + 1
        note = {
            "id": note_id,
            "route_id": route_id,
            "user_id": payload.get("user_id"),
            "content": payload.get("content"),
            "created_at": payload.get("created_at"),
        }
        route["notes"].append(note)
        note_store.append(note)
        return jsonify(note), 201

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
