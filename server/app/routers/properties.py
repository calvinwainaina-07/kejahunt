from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.crud.property import create_property, delete_property, get_all_properties, get_property, update_property
from app.database import get_db
from app.models.property import Property
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyResponse, PropertyUpdate

router = APIRouter(prefix="/properties", tags=["Properties"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/", response_model=list[PropertyResponse])
def read_properties(
    location: Optional[str] = None,
    max_rent: Optional[float] = None,
    house_type: Optional[str] = None,
    bedrooms: Optional[int] = None,
    available: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    return get_all_properties(db, location, max_rent, house_type, bedrooms, available)


@router.get("/mine", response_model=list[PropertyResponse])
def read_my_properties(current_user: CurrentUser, db: Session = Depends(get_db)):
    """Return only listings owned by the signed-in property owner."""
    if current_user.role != "owner" or current_user.property_owner is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only property owners can view their listings")

    return db.query(Property).filter(Property.owner_id == current_user.property_owner.id).all()


@router.get("/{property_id}", response_model=PropertyResponse)
def read_property(property_id: int, db: Session = Depends(get_db)):
    property = get_property(db, property_id)
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return property


@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def add_property(property: PropertyCreate, current_user: CurrentUser, db: Session = Depends(get_db)):
    if current_user.role != "owner" or current_user.property_owner is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only property owners can create listings")
    return create_property(db, property, current_user.property_owner.id)


@router.put("/{property_id}", response_model=PropertyResponse)
def edit_property(property_id: int, property: PropertyUpdate, current_user: CurrentUser, db: Session = Depends(get_db)):
    listing = get_property(db, property_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if current_user.role != "owner" or listing.owner.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot edit this listing")
    return update_property(db, property_id, property)


@router.delete("/{property_id}")
def remove_property(property_id: int, current_user: CurrentUser, db: Session = Depends(get_db)):
    listing = get_property(db, property_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if current_user.role != "owner" or listing.owner.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot delete this listing")
    delete_property(db, property_id)
    return {"message": "Property deleted successfully"}
