import secrets
from flask import jsonify, request, make_response, session
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from app import db, login_manager
from app.auth import bp
from app.models import User

def generate_secure_session_id():
    # Generate a 64-bit (16-byte) random session ID
    token = secrets.token_hex(16)
    return token

@login_manager.user_loader  # Reload a user object based on the user ID stored in the session.
def load_user(user_id):
    user = db.get_or_404(User, user_id)
    return user

@bp.route('/check-session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify({"message": "Session is active", "username": current_user.username}), 200
    else:
        return jsonify({"message": "No active session"}), 401

# Register new users into the User database
@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Check if the username is already present in the database.
    username_check = db.session.execute(db.select(User).where(User.username == username))
    existing_username = username_check.scalar()
    if existing_username:
        return jsonify({"message": "Username already taken"}), 400

    # Check if the email is already present in the database.
    email_check = db.session.execute(db.select(User).where(User.email == email))
    existing_email = email_check.scalar()
    if existing_email:
        return jsonify({"message": "Email already registered"}), 400

    try:
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=8)
        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember=True)

        # Generate a secure session ID and store session details on the server side
        session_id = generate_secure_session_id()
        session['session_id'] = session_id

        response = make_response(jsonify({"session_id": session_id, "username": new_user.username}))
        return response, 201
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({"message": "Server error during registration"}), 500    

# Logs in a user
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    username = data.get('username')
    password = data.get('password')   

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    try:
        result = db.session.execute(db.select(User).where(User.username == username))
        user = result.scalar()
    except Exception as e:
        return jsonify({"message": "An error occurred while fetching the user", "error": str(e)}), 500
    
    if not user:
        return jsonify({"message": "User does not exist"}), 401

    if not check_password_hash(user.password, password):        
        return jsonify({"message": "Invalid password"}), 401
    
    login_user(user, remember=True)

    # Generate a secure session ID for this user and store session details on the server
    session_id = generate_secure_session_id()
    session['session_id'] = session_id

    response = jsonify({"session_id": session_id, "username": user.username})
    return response, 200

@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()

    # Clear the session ID on logout
    session.pop('session_id', None)

    response = make_response(jsonify({'message': 'Logged out successfully'}))
    return response, 200