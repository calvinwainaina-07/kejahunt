from sqlalchemy.orm import Session

from app.models.saved_listing import SavedListing
from app.schemas.saved_listing import SavedListingCreate


def save_property(
    db: Session,
    saved_listing: SavedListingCreate,
    user_id: int,
):
    """
    Save a property for a user.
    """

    new_saved_listing = SavedListing(
        user_id=user_id,
        property_id=saved_listing.property_id,
    )

    db.add(new_saved_listing)
    db.commit()
    db.refresh(new_saved_listing)

    return new_saved_listing


def get_saved_listings(
    db: Session,
    user_id: int,
):
    """
    Get all saved listings for a user.
    """

    return (
        db.query(SavedListing)
        .filter(SavedListing.user_id == user_id)
        .all()
    )


def get_saved_listing(
    db: Session,
    saved_listing_id: int,
):
    """
    Get a saved listing by its ID.
    """

    return (
        db.query(SavedListing)
        .filter(SavedListing.id == saved_listing_id)
        .first()
    )


def delete_saved_listing(
    db: Session,
    saved_listing_id: int,
):
    """
    Remove a saved listing.
    """

    saved_listing = get_saved_listing(db, saved_listing_id)

    if saved_listing is None:
        return None

    db.delete(saved_listing)
    db.commit()

    return saved_listing