from app.extensions import db
from app.utils.time import utcnow

class ClanMessage(db.Model):
    __tablename__ = 'clan_messages'
    __table_args__ = (
        db.UniqueConstraint('clan_id', 'message_id', name = 'unique_clan_message')
    )
    
