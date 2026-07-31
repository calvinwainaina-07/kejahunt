<<<<<<< HEAD
from pydantic import BaseModel, ConfigDict
=======
from datetime import datetime

from pydantic import BaseModel
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602


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
    sent_at: datetime

    model_config = ConfigDict(from_attributes=True)