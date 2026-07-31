from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.saved_listing import (
    SavedListingCreate,
    SavedListingResponse,
)
from app.crud.saved_listing import (
    save_property,
    get_saved_listings,
    get_saved_listing,
    delete_saved_listing,
)

router = APIRouter(
    prefix="/saved-listings",
    tags=["Saved Listings"],
)


@router.post("/", response_model=SavedListingResponse, status_code=201)
def add_saved_listing(
    saved_listing: SavedListingCreate,
    db: Session = Depends(get_db),
):
    # Temporary user ID until authentication is implemented
    user_id = 1

    return save_property(
        db,
        saved_listing,
        user_id,
    )


@router.get("/", response_model=list[SavedListingResponse])
def read_saved_listings(
    db: Session = Depends(get_db),
):
    # Temporary user ID until authentication is implemented
    user_id = 1

    return get_saved_listings(
        db,
        user_id,
    )


@router.get("/{saved_listing_id}", response_model=SavedListingResponse)
def read_saved_listing(
    saved_listing_id: int,
    db: Session = Depends(get_db),
):
    saved_listing = get_saved_listing(
        db,
        saved_listing_id,
    )

    if saved_listing is None:
        raise HTTPException(
            status_code=404,
            detail="Saved listing not found",
        )

    return saved_listing


@router.delete("/{saved_listing_id}")
def remove_saved_listing(
    saved_listing_id: int,
    db: Session = Depends(get_db),
):
    saved_listing = delete_saved_listing(
        db,
        saved_listing_id,
    )

    if saved_listing is None:
        raise HTTPException(
            status_code=404,
            detail="Saved listing not found",
        )

    return {
        "message": "Saved listing removed successfully"
    }