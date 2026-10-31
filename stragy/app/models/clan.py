from stragy.app.server.extensions import db
from app.utils.time import utcnow


class Clan(db.Model):
    __tablename__ = "clans"

    id = db.Column(db.Integer, primaryKey=True)
    name = db.Column(db.String(100), nullable=False)
    vehicle_id = db.Column(
        db.String(70), 
        db.ForeignKey("vehicles_id"),
        nullable=False, 
        index=True,
    )

    description = db.Column(db.Text, nullable=False)
    background_url = db.Column(db.String(250), nullable=True)

    created_by = db.Column(db.DateTime, default=utcnow, nullable=False)


# Relationships

members = db.relationship(
    "ClanMember", backref= "clan", passive_deletes=True, cascade="all, delete-orphan"
)
posts = db.relationship(
    "Post", backref= "club", passive_deletes=True, cascade="all, delete-orphan"
)

messages = db.relationship(
    "ClanMessage",
    backref="clan",
    passive_deletes=True,
    cascade="all, delete-orphan",
)
founder = db.relationship("User", foreign_keys=[created_by])
# ???

def __repr__(self):
    return f"<club {self.name}>"

    

