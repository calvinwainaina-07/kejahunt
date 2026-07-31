from pydantic import BaseModel, ConfigDict


class SavedListingResponse(BaseModel):
    id: int
    user_id: int
    property_id: int

    model_config = ConfigDict(from_attributes=True)
