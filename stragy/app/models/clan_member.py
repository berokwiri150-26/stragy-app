from app.extensions import db
from app.utils import utcnow

class ClanMember(db.Model):
    __tablename__ = 'clan_members'

    id = db.Column(db.Integer, primary_key=True)
    clan_id = db.Column(db.Integer, db.ForeignKey('clans.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='member')
    joined_at = db.Column(db.DateTime, default=utcnow)

    clan = db.relationship('Clan', back_populates='members')
    user = db.relationship('User', back_populates='clan_memberships')

    def __repr__(self):
        return f'<ClanMember id={self.id} clan_id={self.clan_id} user_id={self.user_id} role={self.role}>'