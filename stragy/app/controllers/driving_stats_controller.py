from app.models.user_driving_statistics import UserDrivingStatistics
from server.extensions import db


def list_driving_stats():
    return UserDrivingStatistics.query.all()


def get_driving_stats(user_id):
    return UserDrivingStatistics.query.filter_by(user_id=user_id).first()


def create_driving_stats(data):
    stats = UserDrivingStatistics(
        user_id=data.get("user_id"),
        total_distance=data.get("total_distance"),
        total_trips=data.get("total_trips"),
        longest_trip=data.get("longest_trip"),
        highest_speed=data.get("highest_speed"),
        average_speed=data.get("average_speed"),
        total_fuel_used=data.get("total_fuel_used"),
    )
    db.session.add(stats)
    db.session.commit()
    return stats
