from pydantic import BaseModel


class SavedListingCreate(BaseModel):
    property_id: int


class SavedListingResponse(BaseModel):
    id: int
    user_id: int
    property_id: int

    class Config:
        from_attributes = True