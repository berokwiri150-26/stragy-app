from flask_sqlalchemy import SQLAlchemy
from flask_migrate import migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

db = SQLAlchemy()
migrate = migrate() 
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()