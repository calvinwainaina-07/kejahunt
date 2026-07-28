from pydantic import BaseModel


class PropertyCreate(BaseModel):
    title: str
    description: str
    location: str
    rent: float
    house_type: str
    bedrooms: int
    bathrooms: int
    amenities: str
    image_url: str


class PropertyResponse(PropertyCreate):
    id: int
    available: bool

    class Config:
        from_attributes = True