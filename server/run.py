import sqlalchemy
from flask_migrate import upgrade

from app import create_app, db
from app.models import User

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'sqlalchemy': sqlalchemy, 'db': db, 'User': User}

@app.before_request
def apply_migrations():
    with app.app_context():
        upgrade()  # Apply migrations automatically

if __name__ == "__main__":
    app.run()