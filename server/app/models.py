from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey

from app import db, login_manager

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(100))

    def __repr__(self):
        return f'{self.name}'    
    
class MovieState(db.Model):
    __tablename__ = 'movie_states'

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    movie_id = mapped_column(Integer, nullable=False)  # Adjust this according to your movie table
    state = mapped_column(String(50), nullable=False)
    title = mapped_column(String(255), nullable=True)  # Adjust length as needed
    image_path = mapped_column(String(255), nullable=True)  # Adjust length as needed

    # Relationships
    user = relationship('User', backref='movie_states')

    def __repr__(self):
        return f'{self.user_id} - {self.movie_id} - {self.title} - {self.image_path} - {self.state}'

@login_manager.user_loader  # Reload a user object based on the user ID stored in the session.
def load_user(user_id):
    """
    load_user is a function that takes user_id as an argument. This user_id is typically 
    retrieved from the session data that Flask-Login manages.
    """
    return db.get_or_404(User, user_id)