from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(Integer, ForeignKey("property_owners.id"))

    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)

    location = Column(String(100), nullable=False)

    rent = Column(Float, nullable=False)

    house_type = Column(String(50), nullable=False)

    bedrooms = Column(Integer)
    bathrooms = Column(Integer)

    amenities = Column(Text)

    image_url = Column(String(255))

    available = Column(Boolean, default=True)

    owner = relationship(
        "PropertyOwner",
        back_populates="properties"
    )

    saved_by = relationship(
        "SavedListing",
        back_populates="property",
        cascade="all, delete-orphan",
    )

    messages = relationship(
        "Message",
        back_populates="property",
        cascade="all, delete-orphan",
    )

    viewing_requests = relationship(
        "ViewingRequest",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    @property
    def owner_user_id(self):
        return self.owner.user_id if self.owner else None
