from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class RoommateProfile(Base):
    __tablename__ = "roommate_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    age = Column(Integer)

    budget = Column(Float)

    preferred_location = Column(String(100))

    occupation = Column(String(100))

    lifestyle = Column(String(100))

    traits = Column(String(255))

    bio = Column(Text)

    match_percentage = Column(Integer, default=0)

    user = relationship(
        "User",
        back_populates="roommate_profile"
    )