from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyResponse
from app.crud.property import (
    create_property,
    get_all_properties,
    get_property,
    delete_property
)

router = APIRouter(
    prefix="/properties",
    tags=["Properties"]
)

CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/", response_model=list[PropertyResponse])
def read_properties(db: Session = Depends(get_db)):
    return get_all_properties(db)


@router.get("/{property_id}", response_model=PropertyResponse)
def read_property(property_id: int, db: Session = Depends(get_db)):
    return get_property(db, property_id)


@router.post("/", response_model=PropertyResponse)
def add_property(
    property: PropertyCreate,
    current_user: CurrentUser,
    db: Session = Depends(get_db),
):
    if current_user.role != "owner" or current_user.property_owner is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only property owners can create listings",
        )

    return create_property(
        db,
        property,
        current_user.property_owner.id,
    )


@router.delete("/{property_id}")
def remove_property(
    property_id: int,
    current_user: CurrentUser,
    db: Session = Depends(get_db),
):
    property = get_property(db, property_id)
    if property is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    if current_user.role != "owner" or property.owner.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot delete this listing")

    delete_property(db, property_id)

    return {"message": "Property deleted successfully"}
