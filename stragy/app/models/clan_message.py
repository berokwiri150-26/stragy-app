from app.server.extensions import db
from app.utils.time import utcnow


class ClanMessage(db.Model):
    __tablename__ = "clan_messages"

    id = db.Column(db.Integer, primary_key=True)
    clan_id = db.Column(
        db.Integer, db.ForeignKey("clans.id", ondelete="CASCADE"), nullable=False
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    clan = db.relationship("Clan", back_populates="messages")

    def __repr__(self):
        return f"<ClanMessage clan={self.clan_id} user={self.user_id}>"


