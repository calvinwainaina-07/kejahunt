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
