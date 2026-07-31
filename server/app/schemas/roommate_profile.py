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