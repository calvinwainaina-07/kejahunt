import os
import tempfile
from pathlib import Path


test_directory = Path(tempfile.mkdtemp(prefix="kejahunt-model-tests-"))
os.environ["DATABASE_URL"] = f"sqlite:///{test_directory / 'test.db'}"
os.environ["JWT_SECRET"] = "test-secret-not-for-production-32-bytes"

from fastapi.testclient import TestClient

from app.main import app


def make_client():
    return TestClient(app)


def register_user(client, email, role):
    response = client.post(
        "/auth/register",
        json={
            "full_name": email.split("@")[0].replace(".", " ").title(),
            "email": email,
            "password": "secure-password-123",
            "role": role,
        },
    )
    assert response.status_code == 201
    return response


def test_roommate_profile_endpoints():
    client = make_client()
    register_user(client, "hunter@example.com", "hunter")

    response = client.post(
        "/roommates/",
        json={
            "budget": 20000,
            "preferred_location": "Nairobi",
            "occupation": "Engineer",
            "lifestyle": "Quiet",
            "bio": "Looking for a calm roommate",
        },
    )
    assert response.status_code == 201
    assert response.json()["preferred_location"] == "Nairobi"

    me_response = client.get("/roommates/me")
    assert me_response.status_code == 200
    assert me_response.json()["occupation"] == "Engineer"


def test_saved_listing_endpoints():
    client = make_client()
    register_user(client, "owner@example.com", "owner")

    listing = {
        "title": "Cozy apartment",
        "description": "Bright place",
        "location": "Kilimani",
        "rent": 30000,
        "house_type": "apartment",
        "bedrooms": 2,
        "bathrooms": 2,
        "amenities": "Wi-Fi",
        "image_url": "https://example.com/apartment.jpg",
    }

    property_response = client.post("/properties/", json=listing)
    assert property_response.status_code == 201
    property_id = property_response.json()["id"]

    register_user(client, "saver@example.com", "hunter")
    save_response = client.post(f"/saved-listings/{property_id}")
    assert save_response.status_code == 200

    list_response = client.get("/saved-listings/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    delete_response = client.delete(f"/saved-listings/{property_id}")
    assert delete_response.status_code == 200


def test_message_endpoints():
    client = make_client()
    register_user(client, "sender@example.com", "hunter")
    receiver = register_user(client, "receiver@example.com", "owner")

    listing = {
        "title": "Shared house",
        "description": "Room for rent",
        "location": "Westlands",
        "rent": 18000,
        "house_type": "house",
        "bedrooms": 3,
        "bathrooms": 2,
        "amenities": "Parking",
        "image_url": "https://example.com/house.jpg",
    }
    property_response = client.post("/properties/", json=listing)
    assert property_response.status_code == 201
    property_id = property_response.json()["id"]

    login_response = client.post(
        "/auth/login",
        json={"email": "sender@example.com", "password": "secure-password-123"},
    )
    assert login_response.status_code == 200

    message_response = client.post(
        "/messages/",
        json={
            "receiver_id": receiver.json()["user"]["id"],
            "property_id": property_id,
            "message": "Is the house still available?",
        },
    )
    assert message_response.status_code == 201

    list_response = client.get("/messages/")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
