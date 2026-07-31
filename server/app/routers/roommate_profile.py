from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.crud.roommate_profile import create_roommate_profile, delete_roommate_profile, get_all_roommate_profiles, get_roommate_profile, update_roommate_profile
from app.database import get_db
from app.models.user import User
from app.schemas.roommate_profile import RoommateProfileCreate, RoommateProfileResponse, RoommateProfileUpdate

router = APIRouter(prefix="/roommates", tags=["Roommates"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/", response_model=list[RoommateProfileResponse])
def read_roommate_profiles(current_user: CurrentUser, db: Session = Depends(get_db)):
    return get_all_roommate_profiles(db)


@router.get("/me", response_model=RoommateProfileResponse)
def read_my_roommate_profile(current_user: CurrentUser):
    if current_user.roommate_profile is None:
        raise HTTPException(status_code=404, detail="Roommate profile not found")
    return current_user.roommate_profile


@router.get("/{profile_id}", response_model=RoommateProfileResponse)
def read_roommate_profile(profile_id: int, current_user: CurrentUser, db: Session = Depends(get_db)):
    profile = get_roommate_profile(db, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Roommate profile not found")
    return profile


@router.post("/", response_model=RoommateProfileResponse, status_code=status.HTTP_201_CREATED)
def add_roommate_profile(profile: RoommateProfileCreate, current_user: CurrentUser, db: Session = Depends(get_db)):
    if current_user.roommate_profile is not None:
        raise HTTPException(status_code=409, detail="You already have a roommate profile")
    return create_roommate_profile(db, profile, current_user.id)


@router.put("/me", response_model=RoommateProfileResponse)
def edit_my_roommate_profile(profile: RoommateProfileUpdate, current_user: CurrentUser, db: Session = Depends(get_db)):
    if current_user.roommate_profile is None:
        raise HTTPException(status_code=404, detail="Roommate profile not found")
    return update_roommate_profile(db, current_user.roommate_profile.id, profile)


@router.delete("/me")
def remove_my_roommate_profile(current_user: CurrentUser, db: Session = Depends(get_db)):
    if current_user.roommate_profile is None:
        raise HTTPException(status_code=404, detail="Roommate profile not found")
    delete_roommate_profile(db, current_user.roommate_profile.id)
    return {"message": "Roommate profile deleted successfully"}
