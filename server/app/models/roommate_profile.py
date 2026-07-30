from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class RoommateProfile(Base):
    __tablename__ = "roommate_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    budget = Column(Float)

    preferred_location = Column(String(100))

    occupation = Column(String(100))

    lifestyle = Column(String(100))

    bio = Column(Text)

    user = relationship(
        "User",
        back_populates="roommate_profile"
    )