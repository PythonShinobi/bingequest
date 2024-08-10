import requests
from flask import jsonify, request
from urllib.parse import unquote

from app import db
from app.movie import bp
from config import Config
from app.models import MovieState

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

@bp.route("/movies/search", methods=["GET"])
def search():
    token = Config.ACCESS_TOKEN

    params = {
        "query": request.args.get("query", ""),
        "page": request.args.get('page', 1),
        "include_adult": request.args.get('include_adult', 'true'),
    }

    url = "https://api.themoviedb.org/3/search/movie"

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        json_data = response.json()
        return jsonify(json_data)  # Return only the 'results' array
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code

@bp.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    token = Config.ACCESS_TOKEN

    params = {
        "language": request.args.get('language', 'en-US'),
    }

    url = f'https://api.themoviedb.org/3/movie/{movie_id}'

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        json_data = response.json()
        return jsonify(json_data)  # Return only the 'results' array
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code

@bp.route('/set_movie_state', methods=['POST'])
def set_movie_state():
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    state = data.get('state')
    title = data.get('title')
    image = data.get('image')    

    if not user_id or not movie_id or not state:
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        existing_state = MovieState.query.filter_by(user_id=user_id, movie_id=movie_id).first()
        if existing_state:
            existing_state.state = state
        else:
            new_state = MovieState(
                user_id=user_id, 
                movie_id=movie_id, 
                state=state, 
                title=title, 
                image_path=image
            )
            db.session.add(new_state)
        db.session.commit()
        return jsonify({'message': 'Movie state updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/get_movie_states/<int:user_id>', methods=['GET'])    
def get_movie_states(user_id):
    try:
        movie_states = MovieState.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'movie_id': state.movie_id,
            'state': state.state
        } for state in movie_states]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/watchlist/completed/<int:user_id>', methods=['GET'])
def get_completed_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Completed')

@bp.route('/watchlist/watching/<int:user_id>', methods=['GET'])
def get_watching_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Watching')

@bp.route('/watchlist/plan-to-watch/<int:user_id>', methods=['GET'])
def get_plan_to_watch_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Plan to Watch')

@bp.route('/watchlist/on-hold/<int:user_id>', methods=['GET'])
def get_on_hold_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'On Hold')

@bp.route('/watchlist/dropped/<int:user_id>', methods=['GET'])
def get_dropped_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Dropped')

def get_watchlist_by_state(user_id, state):
    try:
        watchlist = MovieState.query.filter_by(user_id=user_id, state=state).all()
        result = []
        for item in watchlist:
            result.append({
                'id': item.id,
                'user_id': item.user_id,
                'movie_id': item.movie_id,
                'state': item.state,
                'title': item.title,  # Add movie title
                'image_path': item.image_path  # Add movie image path
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@bp.route('/watchlist/<state>/<int:user_id>/<int:movie_id>', methods=['DELETE'])
def remove_from_watchlist(state, user_id, movie_id):
    decoded_state = unquote(state)  # Decode URL-encoded state    
    state_mapping = {
        'completed': 'Completed',
        'watching': 'Watching',
        'plan to watch': 'Plan to Watch',
        'on hold': 'On Hold',
        'dropped': 'Dropped'
    }
    state = state_mapping.get(decoded_state.lower(), None)
    if state is None:
        return jsonify({'error': 'Invalid state'}), 400

    try:
        movie_state = MovieState.query.filter_by(user_id=user_id, movie_id=movie_id, state=state).first()
        if movie_state:
            db.session.delete(movie_state)
            db.session.commit()
            return jsonify({'message': 'Movie removed successfully'}), 200
        else:
            return jsonify({'error': 'Movie not found'}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/movies/recommendations/<int:movie_id>', methods=['GET'])
def get_recommendations(movie_id):
    token = Config.ACCESS_TOKEN
    
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
    }
    
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/recommendations"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code