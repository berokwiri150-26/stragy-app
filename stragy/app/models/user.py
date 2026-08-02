from datetime import datetime

from server.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    join_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    vehicles = db.relationship("Vehicle", back_populates="user", lazy="select")
    personal_records = db.relationship(
        "PersonalRecord", back_populates="user", lazy="select"
    )
    driving_stats = db.relationship(
        "UserDrivingStatistics",
        back_populates="user",
        uselist=False,
        lazy="select",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "join_date": self.join_date.isoformat() if self.join_date else None,
        }
