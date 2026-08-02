from server.extensions import db


class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    make = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(80), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    engine_size = db.Column(db.String(50), nullable=True)
    fuel_type = db.Column(db.String(50), nullable=True)
    tyre_size = db.Column(db.String(50), nullable=True)
    load_capacity = db.Column(db.String(50), nullable=True)

    user = db.relationship("User", back_populates="vehicles")
    trips = db.relationship("Trip", back_populates="vehicle", lazy="select")
    personal_records = db.relationship(
        "PersonalRecord", back_populates="vehicle", lazy="select"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "make": self.make,
            "model": self.model,
            "year": self.year,
            "engine_size": self.engine_size,
            "fuel_type": self.fuel_type,
            "tyre_size": self.tyre_size,
            "load_capacity": self.load_capacity,
        }
