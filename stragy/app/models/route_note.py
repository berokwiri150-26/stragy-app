from datetime import datetime

from server.extensions import db


class RouteNote(db.Model):
    __tablename__ = "route_notes"

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    trip = db.relationship("Trip", back_populates="notes")

    def to_dict(self):
        return {
            "id": self.id,
            "trip_id": self.trip_id,
            "user_id": self.user_id,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
