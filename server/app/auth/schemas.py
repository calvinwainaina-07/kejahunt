"""Pydantic schemas for the authentication API."""

from pydantic import BaseModel, Field, field_validator

from app.schemas.user import UserCreate, UserResponse

# Registration creates a user, so it uses the application's canonical user
# creation schema rather than duplicating its validation rules here.
RegisterRequest = UserCreate


class LoginRequest(BaseModel):
    """Payload accepted when a user signs in."""

    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalise_email(cls, value: str) -> str:
        email = value.strip().lower()
        if "@" not in email or email.startswith("@") or email.endswith("@"):
            raise ValueError("Enter a valid email address")
        return email


class AuthResponse(BaseModel):
    """Response returned by registration and login endpoints."""

    user: UserResponse
    message: str
