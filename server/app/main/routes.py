import requests
from flask import jsonify, request

from app.main import bp
from config import Config

@bp.route('/movies/now_playing', methods=['GET'])
def get_now_playing():
    token = Config.ACCESS_TOKEN
    page = request.args.get('page', default=1, type=int)
    url = f"https://api.themoviedb.org/3/movie/now_playing?language=en-US&page={page}"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code