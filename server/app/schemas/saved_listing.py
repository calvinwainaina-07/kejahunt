<<<<<<< HEAD
from pydantic import BaseModel, ConfigDict
=======
from pydantic import BaseModel


class SavedListingCreate(BaseModel):
    property_id: int
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602


class SavedListingResponse(BaseModel):
    id: int
    user_id: int
    property_id: int

<<<<<<< HEAD
    model_config = ConfigDict(from_attributes=True)
=======
    class Config:
        from_attributes = True
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602
