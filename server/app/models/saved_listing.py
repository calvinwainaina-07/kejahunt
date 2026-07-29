from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class SavedListing(Base):
    __tablename__ = "saved_listings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    property_id = Column(Integer, ForeignKey("properties.id"))

    user = relationship(
        "User",
        back_populates="saved_listings"
    )

    property = relationship(
        "Property",
        back_populates="saved_by"
    )