import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Denormalized on purpose: lets a user's notification list be filtered to
    # whichever dashboard (hunter/owner) it belongs to, in case a user can
    # hold both roles later. For now this will just mirror user.role.
    role = Column(String, nullable=False)

    type = Column(String, nullable=False)      # "Viewing" | "Message" | "Listing" | "Roommate"
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    to = Column(String, nullable=True)         # frontend route to open on click, e.g. "/bookings"
    read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="notifications")

    __table_args__ = (
        Index("ix_notifications_user_role_created", "user_id", "role", "created_at"),
    )
