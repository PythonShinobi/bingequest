import requests
from flask import jsonify, request

from app.people import bp
from config import Config

@bp.route('/people/popular', methods=['GET'])    
def get_popular_people():
    token = Config.ACCESS_TOKEN
    
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
    }
    
    url = "https://api.themoviedb.org/3/trending/person/day"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params=params)    
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code