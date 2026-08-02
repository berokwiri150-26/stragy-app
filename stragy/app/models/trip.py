from datetime import datetime

from server.extensions import db


class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey("vehicles.id"), nullable=False)
    start_time = db.Column(db.DateTime, nullable=True)
    end_time = db.Column(db.DateTime, nullable=True)
    start_location = db.Column(db.String(120), nullable=True)
    end_location = db.Column(db.String(120), nullable=True)
    distance = db.Column(db.Float, nullable=True)
    avg_speed = db.Column(db.Float, nullable=True)
    top_speed = db.Column(db.Float, nullable=True)
    fuel_used = db.Column(db.Float, nullable=True)
    route_type = db.Column(db.String(60), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    vehicle = db.relationship("Vehicle", back_populates="trips")
    notes = db.relationship("RouteNote", back_populates="trip", lazy="select")

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "start_location": self.start_location,
            "end_location": self.end_location,
            "distance": self.distance,
            "avg_speed": self.avg_speed,
            "top_speed": self.top_speed,
            "fuel_used": self.fuel_used,
            "route_type": self.route_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "notes": [note.to_dict() for note in self.notes],
        }
