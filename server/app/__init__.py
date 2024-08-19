from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
import logging
from logging.handlers import RotatingFileHandler

from config import Config

db = SQLAlchemy()

migrate = Migrate()

login_manager = LoginManager()
login_manager.login_view = "auth.login"


def create_app(config=Config):
    flask_app = Flask(__name__)
    flask_app.config.from_object(config)

    db.init_app(flask_app)
    migrate.init_app(flask_app, db)
    login_manager.init_app(flask_app)    

    # Register the authentication blueprint.
    from app.auth import bp as auth_bp
    flask_app.register_blueprint(auth_bp, url_prefix="/api")

    # Register the movie blueprint
    from app.movie import bp as movie_bp
    flask_app.register_blueprint(movie_bp, url_prefix="/api")

    # Register the tv show blueprint
    from app.tv_show import bp as tv_show_bp
    flask_app.register_blueprint(tv_show_bp, url_prefix="/api")

    # Register the popular people blueprint
    from app.people import bp as people_bp
    flask_app.register_blueprint(people_bp, url_prefix="/api")

    # Register the home page blueprint
    from app.home import bp as home_bp
    flask_app.register_blueprint(home_bp, url_prefix="/api")

    # Register the account blueprint
    from app.account import bp as user_account
    flask_app.register_blueprint(user_account, url_prefix="/api")

    # Register the contact blueprint
    from app.contact import bp as contact_bp
    flask_app.register_blueprint(contact_bp, url_prefix="/api")

    # @flask_app.before_request
    # def list_routes():
    #     """Print out all registered routes."""
    #     for rule in flask_app.url_map.iter_rules():
    #         methods = ', '.join(rule.methods)
    #         print(f"{methods} {rule.rule}")

    # Setup logging
    if not flask_app.debug:
        log_path = '/tmp/error.log'  # Use a writable path
        handler = RotatingFileHandler(log_path, maxBytes=10240, backupCount=1)
        handler.setLevel(logging.ERROR)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        flask_app.logger.addHandler(handler)

    return flask_app

from app import models