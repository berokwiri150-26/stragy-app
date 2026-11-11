# Application package for StrAgy.

from app.server.extensions import db
from app.server.app import create_app

__all__ = ["create_app", "db"]
