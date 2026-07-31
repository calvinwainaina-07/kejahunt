from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PropertyCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=10, max_length=5000)
    location: str = Field(min_length=2, max_length=100)
    rent: float = Field(gt=0)
    house_type: str = Field(min_length=2, max_length=50)
    bedrooms: int = Field(ge=0)
    bathrooms: int = Field(ge=0)
    amenities: str = ""
    image_url: str = ""

    @field_validator("title", "description", "location", "house_type")
    @classmethod
    def reject_placeholder_text(cls, value: str) -> str:
        cleaned = value.strip()
        if cleaned.lower() == "string":
            raise ValueError("Enter a real listing detail instead of the placeholder 'string'")
        return cleaned


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    rent: Optional[float] = None
    house_type: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    amenities: Optional[str] = None
    image_url: Optional[str] = None
    available: Optional[bool] = None


class PropertyResponse(PropertyCreate):
    id: int
    owner_id: int
    owner_user_id: int | None = None
    available: bool

    model_config = ConfigDict(from_attributes=True)
