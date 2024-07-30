import os
import sys
import pytest
from werkzeug.security import generate_password_hash

from app import create_app, db
from app.models import User
from config import TestConfig

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture(scope='module')
def test_client():
    # Setup
    app = create_app(config=TestConfig)
    app_context = app.app_context()
    app_context.push()
    
    with app.test_client() as client:
        # Clear cookies by explicitly deleting known cookies
        client.delete_cookie('/')
        yield client
        
    # Teardown
    app_context.pop()

@pytest.fixture(scope='module')
def init_database(test_client):
    # Setup
    db.create_all()
    
    # Create a test user
    hashed_password = generate_password_hash('testpassword', method='pbkdf2:sha256', salt_length=8)
    user = User(name='testuser', email='test@example.com', password=hashed_password)
    db.session.add(user)
    db.session.commit()
    
    yield db
    
    # Teardown
    db.drop_all()

def test_register(test_client, init_database):
    response = test_client.post('/api/register', json={
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'newpassword'
    })
    assert response.status_code == 201
    assert b'Registration successful' in response.data

def test_login(test_client, init_database):
    response = test_client.post('/api/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 200
    assert b'Login successful' in response.data

def test_login_invalid_credentials(test_client):
    response = test_client.post('/api/login', json={
        'username': 'testuser',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    assert b'Invalid email or password' in response.data

def test_get_user_authenticated(test_client, init_database):
    # First, log in to get a session
    test_client.post('/api/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    
    response = test_client.get('/api/user')
    assert response.status_code == 200
    assert b'testuser' in response.data

def test_get_user_not_authenticated(test_client):
    response = test_client.get('/api/user')
    print(f"Status code: {response.status_code}")
    print(f"Payload: {response.data}")
    assert response.status_code == 401
    assert b'User not authenticated' in response.data

def test_logout(test_client, init_database):
    # Log in before testing logout
    test_client.post('/api/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    
    response = test_client.get('/api/logout')
    assert response.status_code == 200
    assert b'Logged out successfully' in response.data