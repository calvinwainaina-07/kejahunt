"""Shared schemas for the application's user resource."""

from pydantic import BaseModel, ConfigDict, Field, field_validator


class UserCreate(BaseModel):
    """Validated fields required to create a user account."""

    full_name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=128)
    role: str = Field(pattern="^(hunter|owner)$")
    phone: str = Field(default="", max_length=32)

    @field_validator("email")
    @classmethod
    def normalise_email(cls, value: str) -> str:
        email = value.strip().lower()
        if "@" not in email or email.startswith("@") or email.endswith("@"):
            raise ValueError("Enter a valid email address")
        return email


class UserResponse(BaseModel):
    """Public user data; the password is deliberately excluded."""

    id: int
    full_name: str
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(UserResponse):
    phone: str = ""
    location: str = ""


class UserUpdate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    phone: str = Field(default="", max_length=32)
    location: str = Field(default="", max_length=100)


class PasswordUpdate(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)
