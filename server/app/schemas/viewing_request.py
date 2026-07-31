from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ViewingStatus = Literal["Pending", "Confirmed", "Declined", "Reschedule requested"]


class ViewingRequestCreate(BaseModel):
    property_id: int
    requested_date: date
    requested_time: str = Field(min_length=1, max_length=10)
    note: str = Field(default="", max_length=1000)


class ViewingRequestUpdate(BaseModel):
    status: ViewingStatus


class ViewingRequestResponse(BaseModel):
    id: int
    property_id: int
    hunter_id: int
    hunter_name: str
    requested_date: date
    requested_time: str
    note: str
    status: ViewingStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
