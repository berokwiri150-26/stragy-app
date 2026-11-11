from app.server.extensions import db
from app.utils.time import utcnow


class Clan(db.Model):
    __tablename__ = "clans"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    vehicle_id = db.Column(
        db.Integer, db.ForeignKey("vehicles.id"), nullable=False, index=True
    )
    description = db.Column(db.Text, nullable=False)
    background_url = db.Column(db.String(250), nullable=True)
    created_by = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    # Relationships
    vehicle = db.relationship("Vehicle", back_populates="clan")
    members = db.relationship(
        "ClanMember",
        back_populates="clan",
        passive_deletes=True,
        cascade="all, delete-orphan",
    )
    posts = db.relationship(
        "Post",
        back_populates="clan",
        passive_deletes=True,
        cascade="all, delete-orphan",
    )
    messages = db.relationship(
        "ClanMessage",
        back_populates="clan",
        passive_deletes=True,
        cascade="all, delete-orphan",
    )
    founder = db.relationship("User", foreign_keys=[created_by])

    def __repr__(self):
        return f"<Clan {self.name}>"

    

