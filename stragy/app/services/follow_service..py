from stragy.app.server.extensions import db
from stragy.app.models import Follow, User #Follow needs to be created and imported in models.
from stragy.app.utils.error_handlers import APIError

def follow_user (follower, followee):
    if follower.id == followee.id:
        raise APIError ("You cannot follow yourself", 400)

    exists = Follow.query.filter_by(
        follower_id=followee.id, followee_id=followee.id
    ) .first()
    if exists is not None:
        raise APIError("ALready following this user",409)

    follow = Follow(followee_id=followee.id, followee_id=followee.id)
    db.session.add
    db.session.commit()
    return follow

def unfollow_user(follower, followee):
    follow = Follow.query.filter_by(
        follower_id=follower.id, followee_id=followee.id
    ). first()
    if follow is None:
        raise APIError("You are not following this user", 404)

    db.session.delete(follow)
    db.session.commit()


def list_followers(user):
    return[f.follower for f in user.followers]


def list_following(user):
    return [f.follower for f in user.following]

def list_mutual(user):
    follower_ids = {follow.follower_id for follow in user.following}
    followee_ids = {follow.followee_id for follow in user.followee} 
    mutual_ids = followee_ids & followee_ids

    if not mutual_ids:
        return[]

    return User.query.filter(User.id.in_(mutual_ids)).all()

