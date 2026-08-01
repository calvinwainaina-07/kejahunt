from pydantic import BaseModel, ConfigDict


class RoommateUserResponse(BaseModel):
    """Public account details displayed with a roommate profile."""

    id: int
    full_name: str

    model_config = ConfigDict(from_attributes=True)


class RoommateProfileCreate(BaseModel):
    age: int | None = None
    budget: float
    preferred_location: str
    occupation: str = ""
    lifestyle: str
    traits: str = ""
    bio: str


class RoommateProfileUpdate(RoommateProfileCreate):
    pass


class RoommateProfileResponse(RoommateProfileCreate):
    id: int
    user_id: int
    user: RoommateUserResponse
    match_percentage: int = 0

    model_config = ConfigDict(from_attributes=True)
