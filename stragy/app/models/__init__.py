# Models package for StrAgy.

from app.server.extensions import db

from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.personal_record import PersonalRecord
from app.models.route_note import RouteNote
from app.models.user_driving_statistics import UserDrivingStatistics
from app.models.clan import Clan
from app.models.clan_member import ClanMember
from app.models.clan_message import ClanMessage
from app.models.post import Post
from app.models.follow import Follow

__all__ = [
    "db",
    "User",
    "Vehicle",
    "Trip",
    "PersonalRecord",
    "UserDrivingStatistics",
    "RouteNote",
    "Clan",
    "ClanMember",
    "ClanMessage",
    "Post",
    "Follow",
]
