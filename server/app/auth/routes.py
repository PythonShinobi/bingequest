from flask import jsonify, request, make_response
from flask_login import login_user, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash

from app import db
from app.auth import bp
from app.models import User

@bp.route("/user", methods=["GET"])
def get_user():
    if not current_user.is_authenticated:        
        return jsonify({"message": "User not authenticated"}), 401

    user_data = {
        "id": current_user.id,
        "username": current_user.name,
        "email": current_user.email,
    }
        
    return jsonify(user_data), 200

# Register new users into the User database
@bp.route("/register", methods=["POST"])
def register():    
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Check if the username is already present in the database.
    username_check = db.session.execute(db.select(User).where(User.name == username))
    existing_username = username_check.scalar()
    if existing_username:
        return jsonify({"message": "Username already taken"}), 400

    # Check if the email is already present in the database.
    email_check = db.session.execute(db.select(User).where(User.email == email))
    existing_email = email_check.scalar()
    if existing_email:
        return jsonify({"message": "Email already registered"}), 400

    try:
        new_user = User(
            name=username,
            email=email,
            password=generate_password_hash(password, method='pbkdf2:sha256', salt_length=8),
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({"message": "Server error during registration"}), 500

    response = make_response(jsonify({"message": "Registration successful✅"}))    
    return response, 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid data"}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    try:
        result = db.session.execute(db.select(User).where(User.name == username))
        user = result.scalar()
    except Exception as e:
        return jsonify({"message": "An error occurred while fetching the user", "error": str(e)}), 500

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid email or password"}), 401

    print(f'User data: {user}')
    login_user(user)

    # Prepare the response with user data
    user_data = {
        "id": user.id,
        "username": user.username,
        # Add other fields as needed
    }

    response = jsonify({"message": "Login successful", "user": user_data})
    return response, 200

@bp.route('/logout')
def logout():
    logout_user()  # Handle Flask-Login user logout

    response = make_response(jsonify({'message': 'Logged out successfully'}), 200)           
    return response