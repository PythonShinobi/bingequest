import os
from dotenv import load_dotenv
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

ENV = ".env"

load_dotenv(ENV)

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", 'you-will-never-guess')
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL") or f'sqlite:///{os.path.join(basedir, "app.db")}'
    FRONTEND_ENDPOINT = os.getenv("FRONTEND_ENDPOINT")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SECURE = True  # Set to True in production
    SESSION_COOKIE_DOMAIN = ".developer-path.org"  # This ensures the cookie is available on all subdomains
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SECURE = True  # Set to True in production    
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT") or 25)
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "0").lower() in ["true", "1", "yes"]
    RECIPIENT_EMAIL = os.getenv("RECIPIENT_GMAIL")
    EMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")
    API_KEY = os.getenv("API_KEY")
    ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)  # Sessions will persist for 7 days

class TestConfig(Config):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'  # Using SQLite for testing
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'testsecretkey'