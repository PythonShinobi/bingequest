from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
import logging
from logging.handlers import RotatingFileHandler

from config import Config

db = SQLAlchemy()

migrate = Migrate()

login_manager = LoginManager()
login_manager.login_view = "auth.login"

cors = CORS()

def create_app(config=Config):
    flask_app = Flask(__name__)
    flask_app.config.from_object(config)

    db.init_app(flask_app)

    migrate.init_app(flask_app, db)

    login_manager.init_app(flask_app)

    cors.init_app(flask_app, origins=config.FRONTEND_ENDPOINT, supports_credentials=True)

    # Register the authentication blueprint.
    from app.auth import bp as auth_bp
    flask_app.register_blueprint(auth_bp, url_prefix="/api")

    # Register the movie blueprint
    from app.movie import bp as movie_bp
    flask_app.register_blueprint(movie_bp, url_prefix="/api")

    # Setup logging
    if not flask_app.debug:
        handler = RotatingFileHandler('error.log', maxBytes=10240, backupCount=10)
        handler.setLevel(logging.ERROR)
        flask_app.logger.addHandler(handler)

    return flask_app

from app import models