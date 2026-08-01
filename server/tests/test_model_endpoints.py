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
    assert response.json()["user"]["full_name"] == "Hunter"

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


def test_owner_can_only_fetch_their_own_listings():
    client = make_client()
    first_owner = register_user(client, "first-owner@example.com", "owner")
    listing = {
        "title": "First owner apartment",
        "description": "A spacious two-bedroom apartment.",
        "location": "Kilimani",
        "rent": 35000,
        "house_type": "apartment",
        "bedrooms": 2,
        "bathrooms": 2,
    }
    assert client.post("/properties/", json=listing).status_code == 201

    register_user(client, "second-owner@example.com", "owner")
    listing["title"] = "Second owner apartment"
    assert client.post("/properties/", json=listing).status_code == 201

    response = client.get("/properties/mine")

    assert response.status_code == 200
    assert [property["title"] for property in response.json()] == ["Second owner apartment"]
    assert first_owner.json()["user"]["id"] != response.json()[0]["owner_user_id"]


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
        json={"email": "sender@example.com", "password": "secure-password-123", "role": "hunter"},
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

    delete_response = client.delete(f"/messages/{message_response.json()['id']}")
    assert delete_response.status_code == 200

    list_response = client.get("/messages/")
    assert list_response.status_code == 200
    assert list_response.json() == []


def test_owner_can_confirm_a_viewing_request():
    client = make_client()
    owner = register_user(client, "viewing-owner@example.com", "owner")
    property_response = client.post(
        "/properties/",
        json={
            "title": "Viewing apartment",
            "description": "A bright apartment.",
            "location": "Kilimani",
            "rent": 30000,
            "house_type": "apartment",
            "bedrooms": 2,
            "bathrooms": 1,
        },
    )
    assert property_response.status_code == 201

    hunter = register_user(client, "viewing-hunter@example.com", "hunter")
    viewing_response = client.post(
        "/viewings/",
        json={
            "property_id": property_response.json()["id"],
            "requested_date": "2026-08-10",
            "requested_time": "10:00",
        },
        headers={"Authorization": f"Bearer {hunter.json()['access_token']}"},
    )
    assert viewing_response.status_code == 201

    response = client.patch(
        f"/viewings/{viewing_response.json()['id']}",
        json={"status": "Confirmed"},
        headers={"Authorization": f"Bearer {owner.json()['access_token']}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Confirmed"


def test_owner_can_delete_a_listing_with_related_records():
    client = make_client()
    owner = register_user(client, "delete-owner@example.com", "owner")
    property_response = client.post(
        "/properties/",
        json={
            "title": "Deletable apartment",
            "description": "An apartment to remove.",
            "location": "Westlands",
            "rent": 35000,
            "house_type": "apartment",
            "bedrooms": 1,
            "bathrooms": 1,
        },
        headers={"Authorization": f"Bearer {owner.json()['access_token']}"},
    )
    assert property_response.status_code == 201
    property_id = property_response.json()["id"]

    hunter = register_user(client, "delete-hunter@example.com", "hunter")
    assert client.post(
        f"/saved-listings/{property_id}",
        headers={"Authorization": f"Bearer {hunter.json()['access_token']}"},
    ).status_code == 200
    assert client.post(
        "/viewings/",
        json={"property_id": property_id, "requested_date": "2026-08-10", "requested_time": "11:00"},
        headers={"Authorization": f"Bearer {hunter.json()['access_token']}"},
    ).status_code == 201

    response = client.delete(
        f"/properties/{property_id}",
        headers={"Authorization": f"Bearer {owner.json()['access_token']}"},
    )
    assert response.status_code == 200
    assert client.get(f"/properties/{property_id}").status_code == 404


def test_user_can_permanently_delete_their_account():
    client = make_client()
    registration = register_user(client, "remove-account@example.com", "hunter")
    token = registration.json()["access_token"]

    response = client.delete("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204

    session_response = client.get("/auth/user", headers={"Authorization": f"Bearer {token}"})
    assert session_response.status_code == 401
