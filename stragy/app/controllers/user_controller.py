from app.models.user import User
from server.extensions import db


def create_user(data):
    user = User(
        username=data.get("username"),
        password_hash=data.get("password_hash") or data.get("password"),
    )
    db.session.add(user)
    db.session.commit()
    return user


def list_users():
    return User.query.all()
