from flask import Blueprint

bp = Blueprint('popular_people', __name__)

from app.people import routes