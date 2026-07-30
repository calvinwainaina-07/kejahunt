from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.roommate_profile import RoommateProfile
from app.models.user import User
from app.schemas.roommate_profile import RoommateProfileCreate, RoommateProfileResponse

router = APIRouter(prefix="/roommate-profiles", tags=["Roommate Profiles"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/", response_model=list[RoommateProfileResponse])
def read_roommate_profiles(db: Session = Depends(get_db)):
    return db.query(RoommateProfile).all()


@router.get("/me", response_model=RoommateProfileResponse)
def read_current_roommate_profile(current_user: CurrentUser, db: Session = Depends(get_db)):
    profile = db.query(RoommateProfile).filter(RoommateProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roommate profile not found")
    return profile


@router.post("/", response_model=RoommateProfileResponse)
def create_or_update_roommate_profile(
    data: RoommateProfileCreate,
    current_user: CurrentUser,
    db: Session = Depends(get_db),
):
    profile = db.query(RoommateProfile).filter(RoommateProfile.user_id == current_user.id).first()
    if profile is None:
        profile = RoommateProfile(user_id=current_user.id)
        db.add(profile)

    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
