from pydantic import BaseModel, ConfigDict


class MessageCreate(BaseModel):
    receiver_id: int
    property_id: int
    message: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    property_id: int
    message: str

    model_config = ConfigDict(from_attributes=True)