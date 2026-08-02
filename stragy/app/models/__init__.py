from server.extensions import db

from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.personal_record import PersonalRecord
from app.models.route_note import RouteNote
from app.models.user_driving_statistics import UserDrivingStatistics

__all__ = [
    "db",
    "User",
    "Vehicle",
    "Trip",
    "PersonalRecord",
    "UserDrivingStatistics",
    "RouteNote",
]
