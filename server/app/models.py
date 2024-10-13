from datetime import datetime
from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, DateTime

from app import db, bcrypt

class User(db.Model, UserMixin):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)

    # Change the backref name to avoid conflict
    user_sessions = relationship('Session', backref='owner', lazy=True)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class Session(db.Model):
    __tablename__ = "sessions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    session_token: Mapped[str] = mapped_column(String(255), nullable=False)  # Length may vary depending on token
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False) 
    
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
    
class TVShowState(db.Model):
    __tablename__ = 'tv_show_states'

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    tv_show_id = mapped_column(Integer, nullable=False)  # Adjust this according to your TV show table
    state = mapped_column(String(50), nullable=False)
    title = mapped_column(String(255), nullable=True)  # Adjust length as needed
    image_path = mapped_column(String(255), nullable=True)  # Adjust length as needed

    # Relationships
    user = relationship('User', backref='tv_show_states')

    def __repr__(self):
        return f'{self.user_id} - {self.tv_show_id} - {self.title} - {self.image_path} - {self.state}'    