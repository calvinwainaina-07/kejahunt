<<<<<<< HEAD
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RoommateProfileCreate(BaseModel):
    budget: float | None = None
    preferred_location: str | None = None
    occupation: str | None = None
    lifestyle: str | None = None
    bio: str | None = None


class RoommateProfileResponse(RoommateProfileCreate):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
=======
from pydantic import BaseModel


class RoommateProfileCreate(BaseModel):
    age: int
    budget: float
    preferred_location: str
    occupation: str
    lifestyle: str
    traits: str
    bio: str


class RoommateProfileUpdate(BaseModel):
    age: int
    budget: float
    preferred_location: str
    occupation: str
    lifestyle: str
    traits: str
    bio: str


class RoommateProfileResponse(BaseModel):
    id: int
    user_id: int
    age: int
    budget: float
    preferred_location: str
    occupation: str
    lifestyle: str
    traits: str
    bio: str
    match_percentage: int

    class Config:
        from_attributes = True
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602
