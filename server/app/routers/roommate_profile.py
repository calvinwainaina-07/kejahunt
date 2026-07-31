from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.roommate_profile import (
    RoommateProfileCreate,
    RoommateProfileUpdate,
    RoommateProfileResponse,
)
from app.crud.roommate_profile import (
    create_roommate_profile,
    get_all_roommate_profiles,
    get_roommate_profile,
    update_roommate_profile,
    delete_roommate_profile,
)

router = APIRouter(
    prefix="/roommates",
    tags=["Roommates"]
)


@router.get("/", response_model=list[RoommateProfileResponse])
def read_roommate_profiles(db: Session = Depends(get_db)):
    return get_all_roommate_profiles(db)


@router.get("/{profile_id}", response_model=RoommateProfileResponse)
def read_roommate_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = get_roommate_profile(db, profile_id)

    if not profile:
        raise HTTPException(status_code=404, detail="Roommate profile not found")

    return profile


@router.post("/", response_model=RoommateProfileResponse, status_code=201)
def add_roommate_profile(
    profile: RoommateProfileCreate,
    db: Session = Depends(get_db),
):
    # Temporary until authentication is integrated
    user_id = 1

    return create_roommate_profile(
        db,
        profile,
        user_id,
    )


@router.put("/{profile_id}", response_model=RoommateProfileResponse)
def edit_roommate_profile(
    profile_id: int,
    profile: RoommateProfileUpdate,
    db: Session = Depends(get_db),
):
    updated_profile = update_roommate_profile(
        db,
        profile_id,
        profile,
    )

    if not updated_profile:
        raise HTTPException(status_code=404, detail="Roommate profile not found")

    return updated_profile


@router.delete("/{profile_id}")
def remove_roommate_profile(
    profile_id: int,
    db: Session = Depends(get_db),
):
    profile = delete_roommate_profile(db, profile_id)

    if not profile:
        raise HTTPException(status_code=404, detail="Roommate profile not found")

    return {"message": "Roommate profile deleted successfully"}