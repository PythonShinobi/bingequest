from flask import jsonify, abort
from flask_login import current_user
from sqlalchemy.exc import SQLAlchemyError

from app import db, login_manager
from app.account import bp
from app.models import User, MovieState, TVShowState

@login_manager.user_loader  # Reload a user object based on the user ID stored in the session.
def load_user(user_id):
    user = db.get_or_404(User, user_id)
    return user

@bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    if not current_user.is_authenticated:
        abort(401, description="Unauthorized access")

    user_id = current_user.id
    try:
        user = User.query.get(user_id)
        if user is None:
            abort(404, description="User not found")

        # Delete related records manually
        MovieState.query.filter_by(user_id=user_id).delete()
        TVShowState.query.filter_by(user_id=user_id).delete()

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error deleting user: {e}")
        return jsonify({"error": "An error occurred while deleting the account"}), 500