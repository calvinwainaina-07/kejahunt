"""Integration tests for JWT session authentication."""

import os
import tempfile
from pathlib import Path

# These values must be set before importing the application and its database.
test_directory = Path(tempfile.mkdtemp(prefix="kejahunt-auth-tests-"))
os.environ["DATABASE_URL"] = f"sqlite:///{test_directory / 'test.db'}"
os.environ["JWT_SECRET"] = "test-secret-not-for-production"

from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app
from app.models.user import User


def test_registration_hashes_password_and_starts_session():
    client = TestClient(app)
    response = client.post(
        "/auth/register",
        json={
            "full_name": "Jane Hunter",
            "email": "jane@example.com",
            "password": "correct-horse-battery-staple",
            "role": "hunter",
        },
    )

    assert response.status_code == 201
    assert response.json()["user"] == {
        "id": 1,
        "full_name": "Jane Hunter",
        "email": "jane@example.com",
        "role": "hunter",
    }
    assert "access_token" in response.cookies

    with SessionLocal() as db:
        user = db.query(User).filter_by(email="jane@example.com").one()
        assert user.password != "correct-horse-battery-staple"

    response = client.get("/auth/user")
    assert response.status_code == 200
    assert response.json()["user"]["email"] == "jane@example.com"


def test_invalid_credentials_and_duplicate_email_are_rejected():
    client = TestClient(app)

    response = client.post(
        "/auth/register",
        json={
            "full_name": "Duplicate User",
            "email": "jane@example.com",
            "password": "another-secure-password",
            "role": "hunter",
        },
    )
    assert response.status_code == 409

    response = client.post(
        "/auth/login",
        json={"email": "jane@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_only_an_authenticated_owner_can_create_a_listing():
    client = TestClient(app)
    listing = {
        "title": "Quiet studio",
        "description": "A sunny studio near town.",
        "location": "Nairobi",
        "rent": 25000,
        "house_type": "studio",
        "bedrooms": 1,
        "bathrooms": 1,
        "amenities": "Water",
        "image_url": "https://example.com/studio.jpg",
    }

    assert client.post("/properties/", json=listing).status_code == 401

    response = client.post(
        "/auth/register",
        json={
            "full_name": "Olivia Owner",
            "email": "olivia@example.com",
            "password": "correct-horse-battery-staple",
            "role": "owner",
        },
    )
    assert response.status_code == 201

    response = client.post("/properties/", json=listing)
    assert response.status_code == 200
    assert response.json()["title"] == "Quiet studio"
