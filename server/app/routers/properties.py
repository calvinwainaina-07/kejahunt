from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.property import (
    PropertyCreate,
    PropertyUpdate,
    PropertyResponse,
)
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
    db: Session = Depends(get_db),
):
    # Temporary until authentication is integrated
    owner_id = 1

    return create_property(
        db=db,
        property_data=property,
        owner_id=owner_id,
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