from builtins import property as builtin_property
from datetime import UTC, datetime

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class ViewingRequest(Base):
    __tablename__ = "viewing_requests"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False, index=True)
    hunter_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    requested_date = Column(Date, nullable=False)
    requested_time = Column(String(10), nullable=False)
    note = Column(Text, default="", nullable=False)
    status = Column(String(32), default="Pending", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)

    property = relationship("Property")
    hunter = relationship("User", foreign_keys=[hunter_id])

    @builtin_property
    def hunter_name(self):
        return self.hunter.full_name if self.hunter else "House hunter"
