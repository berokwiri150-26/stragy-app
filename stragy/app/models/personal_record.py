from datetime import datetime

from server.extensions import db


class PersonalRecord(db.Model):
    __tablename__ = "personal_records"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey("vehicles.id"), nullable=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"), nullable=True)
    record_type = db.Column(db.String(80), nullable=False)
    value = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(30), nullable=True)
    date_achieved = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", back_populates="personal_records")
    vehicle = db.relationship("Vehicle", back_populates="personal_records")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "vehicle_id": self.vehicle_id,
            "trip_id": self.trip_id,
            "record_type": self.record_type,
            "value": self.value,
            "unit": self.unit,
            "date_achieved": self.date_achieved.isoformat() if self.date_achieved else None,
        }
