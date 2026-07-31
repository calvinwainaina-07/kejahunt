from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class RoommateConnection(Base):
    """Records that one hunter pressed 'Connect' on another hunter's roommate profile."""

    __tablename__ = "roommate_connections"

    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    requester = relationship("User", foreign_keys=[requester_id])
    target = relationship("User", foreign_keys=[target_id])

    __table_args__ = (
        # Same pair can't connect twice - prevents duplicate notification spam
        # from repeated button presses.
        UniqueConstraint("requester_id", "target_id", name="uq_roommate_connection_pair"),
    )