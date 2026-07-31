from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    phone = Column(String(32), nullable=False, default="")
    location = Column(String(100), nullable=False, default="")

    property_owner = relationship(
        "PropertyOwner",
        back_populates="user",
        uselist=False
    )

    house_hunter = relationship(
        "HouseHunter",
        back_populates="user",
        uselist=False
    )

    roommate_profile = relationship(
        "RoommateProfile",
        back_populates="user",
        uselist=False
    )

    saved_listings = relationship(
        "SavedListing",
        back_populates="user"
    )

    sent_messages = relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender"
    )

    received_messages = relationship(
        "Message",
        foreign_keys="Message.receiver_id",
        back_populates="receiver"
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan"
        )
