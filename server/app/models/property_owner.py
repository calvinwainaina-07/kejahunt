from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PropertyOwner(Base):
    __tablename__ = "property_owners"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    user = relationship(
        "User",
        back_populates="property_owner"
    )

    properties = relationship(
        "Property",
        back_populates="owner"
    )