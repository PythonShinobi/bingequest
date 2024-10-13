import os
from dotenv import load_dotenv

env = ".env"

# Load environment variable from .env file
load_dotenv(env)

# Use /tmp for writable access in Vercel serverless environment
db_path = os.path.join('/tmp', 'bingequest.db')  # Temporary path for SQLite in serverless

class Config:
    # Default configuration
    SECRET_KEY = "t8hrNO6ibFODgZWxhunyhQ"
    FRONTEND_ENDPOINT = 'https://bingequest.developer-path.org'    

    # Set the SQLAlchemy database URI for SQLite in /tmp
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'  # SQLite URI format
    SQLALCHEMY_TRACK_MODIFICATIONS = False