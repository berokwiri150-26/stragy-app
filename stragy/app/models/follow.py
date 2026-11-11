"""Follow association (self-referential many-to-many on ``User``).

The history: ``services/follow_service`` imports ``from app.models import
Follow`` and uses ``Follow.query`` / ``User.following`` / ``User.followers``,
but no ``Follow`` model existed, so that import raised ``ImportError``. Only
``follow_service`` references it (it is not imported by the app yet), but this
keeps that import valid and gives the model a table.
"""

from app.server.extensions import db


class Follow(db.Model):
    __tablename__ = "follows"
    __table_args__ = (
        db.UniqueConstraint("follower_id", "followee_id", name="unique_follow"),
        db.CheckConstraint(
            "follower_id != followee_id", name="no_self_follow"
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    followee_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )

    # ``following`` = follows the current user follows (we are the follower).
    follower = db.relationship(
        "User", foreign_keys=[follower_id], backref="following"
    )
    # ``followers`` = follows where the current user is the followee.
    followee = db.relationship(
        "User", foreign_keys=[followee_id], backref="followers"
    )

    def __repr__(self):
        return f"<Follow {self.follower_id} -> {self.followee_id}>"