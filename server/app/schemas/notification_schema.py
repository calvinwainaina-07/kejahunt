from typing import Optional, List, Literal
from pydantic import BaseModel

NotificationType = Literal["Viewing", "Message", "Listing", "Roommate"]
Role = Literal["hunter", "owner"]


class NotificationOut(BaseModel):
    id: int
    type: NotificationType
    title: str
    message: str
    to: Optional[str] = None
    read: bool
    time: str  # humanized, computed at serialization time

    class Config:
        from_attributes = True


class NotificationCreate(BaseModel):
    """Used internally by other services (bookings, messages, etc.), not exposed as a public endpoint."""
    user_id: int
    role: Role
    type: NotificationType
    title: str
    message: str
    to: Optional[str] = None


class MarkReadRequest(BaseModel):
    ids: Optional[List[int]] = None  # omit/None -> mark all as read