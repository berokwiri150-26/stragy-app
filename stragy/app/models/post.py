from app.extensions import db
from app.utils.time import utcnow

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", onDelete="CASCADE"), nullable=False
    )
    clan_id = db.Column(
        db.Integer, db.ForeignKey("clans.id", onDelete="CASCADE", nullable=True)
    )

    trip_title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.text, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)
    # database id required to fill this, e,g: tvdb_id = db.Column(db.Integer, nullable=True)

    # relationships
    comments = db.relationship(
        "Comment", backref="post", passive_deletes= True, cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Post {self.movie_title!r}by user={self.user_id}>"