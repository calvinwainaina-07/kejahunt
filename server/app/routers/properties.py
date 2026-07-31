<<<<<<< HEAD
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
=======
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
<<<<<<< HEAD
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyResponse
=======
from app.schemas.property import (
    PropertyCreate,
    PropertyUpdate,
    PropertyResponse,
)
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602
from app.crud.property import (
    create_property,
    get_all_properties,
    get_property,
    update_property,
    delete_property,
)

router = APIRouter(
    prefix="/properties",
    tags=["Properties"]
)

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
    return get_all_properties(
        db=db,
        location=location,
        max_rent=max_rent,
        house_type=house_type,
        bedrooms=bedrooms,
        available=available,
    )


@router.get("/{property_id}", response_model=PropertyResponse)
def read_property(
    property_id: int,
    db: Session = Depends(get_db),
):
    property = get_property(db, property_id)

    if property is None:
        raise HTTPException(
            status_code=404,
            detail="Property not found",
        )

    return property


@router.post("/", response_model=PropertyResponse, status_code=201)
def add_property(
    property: PropertyCreate,
<<<<<<< HEAD
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
=======
    db: Session = Depends(get_db),
):
    # Temporary until authentication is integrated
    owner_id = 1

    return create_property(
        db=db,
        property_data=property,
        owner_id=owner_id,
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602
    )


@router.put("/{property_id}", response_model=PropertyResponse)
def edit_property(
    property_id: int,
    property: PropertyUpdate,
    db: Session = Depends(get_db),
):
    updated_property = update_property(
        db=db,
        property_id=property_id,
        property_data=property,
    )

    if updated_property is None:
        raise HTTPException(
            status_code=404,
            detail="Property not found",
        )

    return updated_property


@router.delete("/{property_id}")
def remove_property(
    property_id: int,
<<<<<<< HEAD
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
=======
    db: Session = Depends(get_db),
):
    deleted_property = delete_property(
        db=db,
        property_id=property_id,
    )

    if deleted_property is None:
        raise HTTPException(
            status_code=404,
            detail="Property not found",
        )

    return {
        "message": "Property deleted successfully"
    }
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602
