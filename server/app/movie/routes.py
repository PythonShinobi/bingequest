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
        "with_genres": request.args.get('with_genres', None)
    }
    
    release_date_gte = request.args.get('release_date_gte', None)
    release_date_lte = request.args.get('release_date_lte', None)
    
    # Add release_date.gte and release_date.lte to params if they are provided
    if release_date_gte:
        params["release_date.gte"] = release_date_gte
    if release_date_lte:
        params["release_date.lte"] = release_date_lte
    
    url = "https://api.themoviedb.org/3/discover/movie"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # Filter out None values from params
    filtered_params = {k: v for k, v in params.items() if v is not None}
    
    response = requests.get(url, headers=headers, params=filtered_params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code

@bp.route('/movies/trending', methods=['GET'])    
def get_trending_movies():
    token = Config.ACCESS_TOKEN
    
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
    }
    
    url = "https://api.themoviedb.org/3/trending/movie/day"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params=params)
    
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
        "with_genres": request.args.get('with_genres', None)
    }
    
    release_date_gte = request.args.get('release_date_gte', None)
    release_date_lte = request.args.get('release_date_lte', None)
    vote_count_gte = request.args.get('vote_count_gte', None)
    vote_count_lte = request.args.get('vote_count_lte', None)
    
    # Add release_date.gte and release_date.lte to params if they are provided
    if release_date_gte:
        params["release_date.gte"] = release_date_gte
    if release_date_lte:
        params["release_date.lte"] = release_date_lte
    
    # Add vote_count.gte and vote_count.lte to params if they are provided
    if vote_count_gte:
        params["vote_count.gte"] = vote_count_gte
    if vote_count_lte:
        params["vote_count.lte"] = vote_count_lte
    
    url = "https://api.themoviedb.org/3/discover/movie"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # Filter out None values from params
    filtered_params = {k: v for k, v in params.items() if v is not None and v != ''}        
    
    response = requests.get(url, headers=headers, params=filtered_params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        print("Error Response:", response.json())
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code

@bp.route('/movies/upcoming', methods=['GET'])
def get_upcoming_movies():
    token = Config.ACCESS_TOKEN
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
        "sort_by": request.args.get('sort_by', 'release_date.desc'),
        "include_adult": request.args.get('include_adult', 'false'),
        "primary_release_year": request.args.get('primary_release_year', None),
        "with_genres": request.args.get('with_genres', None),
        "release_date.gte": request.args.get('release_date_gte', None),
        "release_date.lte": request.args.get('release_date_lte', None)
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