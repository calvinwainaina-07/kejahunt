from typing import Optional

from pydantic import BaseModel


class PropertyCreate(BaseModel):
    owner_id: int
    title: str
    description: str
    location: str
    rent: float
    house_type: str
    bedrooms: int
    bathrooms: int
    amenities: str
    image_url: str


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
    available: bool

    class Config:
        from_attributes = True