# Controllers package for StrAgy.

# NOTE (import fix): this file used to import a set of blueprints
# (``drivingstats_bp``, ``personal_bp``, ``trip_bp``, ``user_bp``,
# ``vehiclecatalog_bp``, ``vehicle_bp``) that did not exist in those controller
# modules -- the controllers expose plain functions (``create_*`` / ``list_*``)
# that ``app.server.app``'s ``register_routes`` binds directly. Only ``admin``
# defines a real blueprint, ``admin_bp``. Importing those missing names made
# ``import app.controllers`` raise ``ImportError: cannot import name ...``.
from app.controllers.admin import admin_bp


def register_blueprints(app):
    """Register the Flask blueprints available in this package."""
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    return app