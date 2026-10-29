from app.extensions import db
from app.utils.time import utcnow

class ClanMessage(db.Model):
    __tablename__ = 'clan_messages'
    __table_args__ = (
        db.UniqueConstraint('clan_id', 'message_id', name = 'unique_clan_message')
    )

    id = db.Column(db.integer, primary_key=True)
    clan_id = db.Column(
        db.Integer,
        db.ForeignKey("clubs.id", onDelete="CASCADE"),
        nullable = False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", onDelete="CASCADE"),
        nullable=False,
    )

    message = db.Column(db.Text, nullable = False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable = False)

    def __repr__(self):
        return f"<ClubMessage club={self.club_id} user={self.user_id}>"


