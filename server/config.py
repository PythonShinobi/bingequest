import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

ENV = ".env"

load_dotenv(ENV)

class Config:
    SECRET_KEY = os.getenv("SECRETE_KEY") or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL") or f'sqlite:///{os.path.join(basedir, "app.db")}'
    FRONTEND_ENDPOINT = os.getenv("FRONTEND_ENDPOINT", "http://localhost:3000")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # Set to True in production
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SECURE = False  # Set to True in production    
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT") or 25)
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") is not None
    RECIPIENT_EMAIL = os.getenv("RECIPIENT_GMAIL")
    EMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")
    API_KEY = os.getenv("API_KEY")
    ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")

class TestConfig(Config):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'  # Using SQLite for testing
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'testsecretkey'