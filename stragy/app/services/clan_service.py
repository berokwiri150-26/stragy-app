"Logic for clans and clan membership management."

"""Kept out of the blueprint so the HTTP layer only deals with request/response
concerns -- every function here takes plain values in and returns model
instances (or raises APIError), with no knowledge of Flask.
"""

from unicodedata import name
# For the name function to not be red. Need to identify what import is missing.

from app.server.extensions import db
from app.models import Clan, ClanMember
from app.utils import APIError

def create_clan(creator, vehicle_make, desctiption=None, background_url=None):
    clan = Clan(
        name=name,
        vehicle_make=vehicle_make,
        description=desctiption,
        background_url=background_url,
        created_by=creator.id,
    )

    db.session.add(clan)
    db.session.flush()  #Assigns club.id without committing, so we can use it in the next step

    membership = ClanMember(
        clan_id = clan.id, user_id = creator.id, role = "ADMIN_ROLE")
    db.session.add(membership)
    db.session.commit()
    return clan

def list_clans(page, per_page):
    pagination = Clan.query.order_by(Clan.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return pagination

def update_clan(clan, current_user_id, fields):
    if not is_clan_admin(current_user_id, clan.id):
        raise APIError("Only clan admins can update this clan",403)

    for key, value in fields.items():
        setattr(clan, key, value)
    db.session.commit()
    return clan

def join_clan(clan, user):
    if get_membership(user.id, clan.id) is not None:
        raise APIError("Already a member of this club", 409)

    membership = ClanMember(clan_id=clan.id, user_id=user.id, role=MEMBER_ROLE)
    db.session.add(membership)
    db.session.commit()
    return membership

def leave_clan(clan, user):
    membership = get_membership(user.id, clan.id)
    if membership is None:
        raise APIError  ("Not a member of this club", 404)

    if membership.role == ADMIN_ROLE and _admin_count(clan.id) <= 1:
        raise APIError("The last admin cannot leave the club", 400)

    db.session.delete(membership)
    db.session.commit()


def update_member_role(clan, current_user_id, target_user_id, new_role):
    if new_role not in (ADMIN_ROLE, MEMBER_ROLE):
        raise APIError ("Role must be 'admin' or 'member'", 400)

    if not is_clan_admin(current_user_id, clan.id):
        raise APIError ("Only clan admins can change member roles", 403)

    membership = get_membership(target_user_id, clan.id)
    if membership is None:
        raise APIError("That user is not a mamber of this clan", 404)

    if membership.role == ADMIN_ROLE and new_role == MEMBER_ROLE and _admin_count(clan.id) <= 1:
        raise APIError("The last admin cannot be demoted", 400)

    membership.role = new_role
    db.session.commit()
    return membership

def remove_member(clan, current_user_id, targer_user_id):
    if not is_clan_admin(current_user_id, clan.id):
        raise APIError("Only clan admins can remove members", 403)

    membership = get_membership(targer_user_id, clan.id)
    if membership is None:
        raise APIError("That user is not a member of this clan", 404)

    if membership.role == ADMIN_ROLE and _admin_count(clan.id) <= 1:
        raise APIError("The last admin cannot be removed", 400)
    db.session.delete(membership)
    db.session.commit()

    def _admin_count(clan_id):
        return ClanMember.query.filter_by(clan_id=clan.id, role=ADMIN_ROLE).count()
