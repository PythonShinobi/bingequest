from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String

from app import db, login_manager

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(100))

    def __repr__(self):
        return f'{self.name}'    

@login_manager.user_loader  # Reload a user object based on the user ID stored in the session.
def load_user(user_id):
    """
    load_user is a function that takes user_id as an argument. This user_id is typically 
    retrieved from the session data that Flask-Login manages.
    """
    return db.get_or_404(User, user_id)