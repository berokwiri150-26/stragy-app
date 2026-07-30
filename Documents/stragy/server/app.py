from flask_migrate import migrate
from app.models import db

migrate = Migrate(app, db)