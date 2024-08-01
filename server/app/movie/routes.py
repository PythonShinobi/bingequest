import requests
from flask import jsonify, request

from app.movie import bp
from config import Config

@bp.route('/movies/popular', methods=['GET'])
def get_popular_movies():
    token = Config.ACCESS_TOKEN
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
        "sort_by": request.args.get('sort_by', 'popularity.desc'),
        "include_adult": request.args.get('include_adult', 'false'),                
        "primary_release_year": request.args.get('primary_release_year', None),
        "with_genres": request.args.get('with_genres', None),                
    }
    
    url = "https://api.themoviedb.org/3/discover/movie"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params={k: v for k, v in params.items() if v is not None})
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code
    
@bp.route('/movies/newest-releases', methods=['GET'])
def get_newest_releases():
    token = Config.ACCESS_TOKEN
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
        "sort_by": request.args.get('sort_by', 'release_date.desc'),
        "include_adult": request.args.get('include_adult', 'false'),                
        "primary_release_year": request.args.get('primary_release_year', None),
        "with_genres": request.args.get('with_genres', None),                
    }
    
    url = "https://api.themoviedb.org/3/discover/movie"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params={k: v for k, v in params.items() if v is not None})
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code

@bp.route('/movies/top-rated', methods=['GET'])
def get_top_rated_movies():
    token = Config.ACCESS_TOKEN
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
        "sort_by": request.args.get('sort_by', 'vote_average.desc'),
        "include_adult": request.args.get('include_adult', 'false'),                
        "primary_release_year": request.args.get('primary_release_year', None),
        "with_genres": request.args.get('with_genres', None),                
    }
    
    url = "https://api.themoviedb.org/3/discover/movie"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params={k: v for k, v in params.items() if v is not None})
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code

@bp.route('/movies/upcoming', methods=['GET'])
def get_upcoming_movies():
    token = Config.ACCESS_TOKEN
    page = request.args.get('page', 1)

    url = "https://api.themoviedb.org/3/discover/movie"
    
    params = {
        "language": request.args.get('language', 'en-US'),
        "sort_by": request.args.get('sort_by', 'release_date.desc'),
        "page": page
    }
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code    