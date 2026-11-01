from datetime import datetime

from stragy.app.server.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, index=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    is_superuser = db.Column(db.Boolean(120), nullable=False, default=False)
    is_banned = db.Column(db.Boolean(120), nullable=False, default=False)
    bio = db.Column(db.String(255), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    join_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


# relationships
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

    clan_memberships = db.relationship(
        "ClanMember",
        backref="user",
        cascade="all, delete-orphan",
        passive_deletes=True, 
    )

    clan_messages = db.relationship(
        "ClanMessage",
        backref = "user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    posts = db.relationship(
        "Post",
        backref="author",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    trip = db.relationship(
     "Trip",
     backref="user",
    cascade="all, delete-orphan",
    passive_deletes=True,

    )



    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "join_date": self.join_date.isoformat() if self.join_date else None,
        }
