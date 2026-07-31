from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.property import Property
from app.models.saved_listing import SavedListing
from app.models.user import User
from app.schemas.saved_listing import SavedListingResponse

router = APIRouter(prefix="/saved-listings", tags=["Saved Listings"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/", response_model=list[SavedListingResponse])
def read_saved_listings(current_user: CurrentUser, db: Session = Depends(get_db)):
    return db.query(SavedListing).filter(SavedListing.user_id == current_user.id).all()


@router.post("/{property_id}", response_model=SavedListingResponse)
def save_listing(property_id: int, current_user: CurrentUser, db: Session = Depends(get_db)):
    property = db.get(Property, property_id)
    if property is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    existing = (
        db.query(SavedListing)
        .filter(SavedListing.user_id == current_user.id, SavedListing.property_id == property_id)
        .first()
    )
    if existing is not None:
        return existing

    saved_listing = SavedListing(user_id=current_user.id, property_id=property_id)
    db.add(saved_listing)
    db.commit()
    db.refresh(saved_listing)
    return saved_listing


@router.delete("/{property_id}")
def remove_saved_listing(property_id: int, current_user: CurrentUser, db: Session = Depends(get_db)):
    saved_listing = (
        db.query(SavedListing)
        .filter(SavedListing.user_id == current_user.id, SavedListing.property_id == property_id)
        .first()
    )
    if saved_listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved listing not found")

    db.delete(saved_listing)
    db.commit()
    return {"message": "Listing removed from saved items"}
