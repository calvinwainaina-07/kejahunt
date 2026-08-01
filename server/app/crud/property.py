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


def get_all_properties(
    db: Session,
    location: str | None = None,
    max_rent: float | None = None,
    house_type: str | None = None,
    bedrooms: int | None = None,
    available: bool | None = None,
):
    """
    Retrieve all valid property listings.
    """

    query = db.query(Property)

    # Ignore old placeholder/invalid records
    query = query.filter(
        Property.title != "string",
        Property.location != "string",
        Property.house_type != "string",
        Property.rent > 0,
    )

    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if max_rent is not None:
        query = query.filter(Property.rent <= max_rent)
    if house_type:
        query = query.filter(Property.house_type == house_type)
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)
    if available is not None:
        query = query.filter(Property.available == available)

    return query.all()

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
