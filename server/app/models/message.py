from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)

    message = Column(Text, nullable=False)

    sent_at = Column(DateTime, default=datetime.utcnow)

    sender = relationship(
        "User",
        foreign_keys=[sender_id],
        back_populates="sent_messages"
    )

    receiver = relationship(
        "User",
        foreign_keys=[receiver_id],
        back_populates="received_messages"
    )

    property = relationship(
        "Property",
        back_populates="messages"
    )