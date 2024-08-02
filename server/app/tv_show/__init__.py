from flask import Blueprint

bp = Blueprint('tv_shows', __name__)

from app.tv_show import routes
