from sqlalchemy.orm import Session

from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyUpdate


def create_property(
    db: Session,
    property_data: PropertyCreate,
    owner_id: int
):
    """
    Create a new property listing.
    """

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
    """
    Retrieve all property listings.
    """

    return db.query(Property).all()


def get_property(
    db: Session,
    property_id: int
):
    """
    Retrieve a single property by its ID.
    """

    return (
        db.query(Property)
        .filter(Property.id == property_id)
        .first()
    )


def update_property(
    db: Session,
    property_id: int,
    property_data: PropertyUpdate
):
    """
    Update an existing property.
    """

    property = get_property(db, property_id)

    if property is None:
        return None

    update_data = property_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(property, key, value)

    db.commit()
    db.refresh(property)

    return property


def delete_property(
    db: Session,
    property_id: int
):
    """
    Delete a property.
    """

    property = get_property(db, property_id)

    if property is None:
        return None

    db.delete(property)
    db.commit()

    return property