import requests
from flask import jsonify, request
from urllib.parse import unquote

from app import db
from app.tv_show import bp
from config import Config
from app.models import TVShowState

@bp.route('/tv-shows/popular', methods=['GET'])
def get_popular_shows():
    token = Config.ACCESS_TOKEN
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
        "sort_by": request.args.get('sort_by', 'popularity.desc'),
        "include_adult": request.args.get('include_adult', 'false'),
        "first_air_date_year": request.args.get('first_air_date_year', None),
        "with_genres": request.args.get('with_genres', None),
        "include_null_first_air_dates": request.args.get('include_null_first_air_dates', 'false')
    }
    
    # Extract additional date parameters
    first_air_date_gte = request.args.get('first_air_date_gte', None)
    first_air_date_lte = request.args.get('first_air_date_lte', None)
    
    # Add the date parameters to the params dictionary if they are provided
    if first_air_date_gte:
        params["first_air_date.gte"] = first_air_date_gte
    if first_air_date_lte:
        params["first_air_date.lte"] = first_air_date_lte
    
    url = "https://api.themoviedb.org/3/discover/tv"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # Filter out None values from params dictionary
    filtered_params = {k: v for k, v in params.items() if v is not None}
    
    response = requests.get(url, headers=headers, params=filtered_params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code
    
@bp.route('/tv-shows/airing-today', methods=['GET'])
def airing_tv_shows():
    token = Config.ACCESS_TOKEN
    
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
    }
    
    url = "https://api.themoviedb.org/3/tv/airing_today"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code

@bp.route('/tv-shows/top-rated', methods=['GET'])
def get_top_rated_movies():
    token = Config.ACCESS_TOKEN
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
        "sort_by": request.args.get('sort_by', 'vote_average.desc'),
        "include_adult": request.args.get('include_adult', 'false'),
        "first_air_date_year": request.args.get('first_air_date_year', None),
        "with_genres": request.args.get('with_genres', None),
        "include_null_first_air_dates": request.args.get('include_null_first_air_dates', 'false')
    }
    
    # Extract additional date parameters
    first_air_date_gte = request.args.get('first_air_date_gte', None)
    first_air_date_lte = request.args.get('first_air_date_lte', None)
    
    # Add the date parameters to the params dictionary if they are provided
    if first_air_date_gte:
        params["first_air_date.gte"] = first_air_date_gte
    if first_air_date_lte:
        params["first_air_date.lte"] = first_air_date_lte
    
    url = "https://api.themoviedb.org/3/discover/tv"
    
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

@bp.route('/tv-shows/trending', methods=['GET'])
def get_trending_shows():
    token = Config.ACCESS_TOKEN
    
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
    }
    
    url = "https://api.themoviedb.org/3/trending/tv/day"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code
    
@bp.route("/tv-shows/search", methods=["GET"])
def search():
    token = Config.ACCESS_TOKEN

    params = {
        "query": request.args.get("query", ""),
        "page": request.args.get('page', 1),
        "include_adult": request.args.get('include_adult', 'true'),
    }

    url = "https://api.themoviedb.org/3/search/tv"

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
    
@bp.route('/tv-show/<int:show_id>', methods=['GET'])
def get_movie_details(show_id):
    token = Config.ACCESS_TOKEN

    params = {
        "language": request.args.get('language', 'en-US'),
    }

    url = f'https://api.themoviedb.org/3/tv/{show_id}'

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
    
@bp.route('/set_tv_show_state', methods=['POST'])
def set_tv_show_state():
    data = request.get_json()
    user_id = data.get('user_id')
    tv_show_id = data.get('tv_show_id')
    state = data.get('state')
    title = data.get('title')
    image = data.get('image')        

    if not user_id or not tv_show_id or not state:
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        existing_state = TVShowState.query.filter_by(user_id=user_id, tv_show_id=tv_show_id).first()
        if existing_state:
            existing_state.state = state
            existing_state.title = title
            existing_state.image_path = image
        else:
            new_state = TVShowState(
                user_id=user_id, 
                tv_show_id=tv_show_id, 
                state=state, 
                title=title, 
                image_path=image
            )
            db.session.add(new_state)
        db.session.commit()
        return jsonify({'message': 'TV show state updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@bp.route('/get_tv_show_states/<int:user_id>', methods=['GET'])
def get_tv_show_states(user_id):
    try:
        tv_show_states = TVShowState.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'tv_show_id': state.tv_show_id,
            'state': state.state,        
        } for state in tv_show_states]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/tv-watchlist/completed/<int:user_id>', methods=['GET'])
def get_completed_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Completed')

@bp.route('/tv-watchlist/watching/<int:user_id>', methods=['GET'])
def get_watching_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Watching')

@bp.route('/tv-watchlist/plan-to-watch/<int:user_id>', methods=['GET'])
def get_plan_to_watch_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Plan to Watch')

@bp.route('/tv-watchlist/on-hold/<int:user_id>', methods=['GET'])
def get_on_hold_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'On Hold')

@bp.route('/tv-watchlist/dropped/<int:user_id>', methods=['GET'])
def get_dropped_watchlist(user_id):
    return get_watchlist_by_state(user_id, 'Dropped')

def get_watchlist_by_state(user_id, state):
    try:
        watchlist = TVShowState.query.filter_by(user_id=user_id, state=state).all()
        result = []
        for item in watchlist:
            result.append({
                'id': item.id,
                'user_id': item.user_id,
                'tv_show_id': item.tv_show_id,
                'state': item.state,
                'title': item.title,
                'image_path': item.image_path
            })
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/tv-watchlist/<state>/<int:user_id>/<int:tv_show_id>', methods=['DELETE'])
def remove_from_watchlist(state, user_id, tv_show_id):
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
        tv_show_state = TVShowState.query.filter_by(user_id=user_id, tv_show_id=tv_show_id, state=state).first()
        if tv_show_state:
            db.session.delete(tv_show_state)
            db.session.commit()
            return jsonify({'message': 'TV show removed successfully'}), 200
        else:
            return jsonify({'error': 'TV show not found'}), 404
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@bp.route('/tv-show/recommendations/<int:series_id>', methods=['GET'])
def get_recommendations(series_id):
    token = Config.ACCESS_TOKEN
    
    params = {
        "language": request.args.get('language', 'en-US'),
        "page": request.args.get('page', 1),
    }
    
    url = f"https://api.themoviedb.org/3/tv/{series_id}/recommendations"
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Unable to fetch data from TMDb"}), response.status_code