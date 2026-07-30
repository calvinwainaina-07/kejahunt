from sqlalchemy.orm import Session

from app.models.property import Property
from app.schemas.property import PropertyCreate


def create_property(db: Session, property_data: PropertyCreate, owner_id: int):
    new_property = Property(
        owner_id=owner_id,
        title=property_data.title,
        description=property_data.description,
        location=property_data.location,
        rent=property_data.rent,
        house_type=property_data.house_type,
        bedrooms=property_data.bedrooms,
        bathrooms=property_data.bathrooms,
        amenities=property_data.amenities,
        image_url=property_data.image_url,
    )

    db.add(new_property)
    db.commit()
    db.refresh(new_property)

    return new_property


def get_all_properties(db: Session):
    return db.query(Property).all()


def get_property(db: Session, property_id: int):
    return db.query(Property).filter(Property.id == property_id).first()


def delete_property(db: Session, property_id: int):
    property = get_property(db, property_id)

    if property:
        db.delete(property)
        db.commit()

    return property