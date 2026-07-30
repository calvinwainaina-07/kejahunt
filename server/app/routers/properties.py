from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
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


@router.get("/", response_model=list[PropertyResponse])
def read_properties(db: Session = Depends(get_db)):
    return get_all_properties(db)


@router.get("/{property_id}", response_model=PropertyResponse)
def read_property(property_id: int, db: Session = Depends(get_db)):
    return get_property(db, property_id)


@router.post("/", response_model=PropertyResponse)
def add_property(
    property: PropertyCreate,
    db: Session = Depends(get_db)
):
    owner_id = 1

    return create_property(
        db,
        property,
        owner_id
    )


@router.delete("/{property_id}")
def remove_property(
    property_id: int,
    db: Session = Depends(get_db)
):
    delete_property(db, property_id)

    return {"message": "Property deleted successfully"}