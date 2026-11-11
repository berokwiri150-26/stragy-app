from app.server.extensions import db
from app.utils.time import utcnow


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    clan_id = db.Column(
        db.Integer, db.ForeignKey("clans.id", ondelete="CASCADE"), nullable=True
    )

    trip_title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    # Relationships
    clan = db.relationship("Clan", back_populates="posts")

    def __repr__(self):
        return f"<Post {self.trip_title!r} by user={self.user_id}>"