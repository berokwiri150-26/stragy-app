from server.extensions import db


class UserDrivingStatistics(db.Model):
    __tablename__ = "user_driving_statistics"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    total_distance = db.Column(db.Float, nullable=True)
    total_trips = db.Column(db.Integer, nullable=True)
    longest_trip = db.Column(db.Float, nullable=True)
    highest_speed = db.Column(db.Float, nullable=True)
    average_speed = db.Column(db.Float, nullable=True)
    total_fuel_used = db.Column(db.Float, nullable=True)

    user = db.relationship("User", back_populates="driving_stats")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_distance": self.total_distance,
            "total_trips": self.total_trips,
            "longest_trip": self.longest_trip,
            "highest_speed": self.highest_speed,
            "average_speed": self.average_speed,
            "total_fuel_used": self.total_fuel_used,
        }
