from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.house_hunter import HouseHunter
from app.models.property_owner import PropertyOwner
from app.models.user import User
from app.auth.utils import hash_password, verify_password
from app.schemas.user import PasswordUpdate, UserProfileResponse, UserResponse, UserUpdate

router = APIRouter(tags=["Profiles"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/users/me", response_model=UserProfileResponse)
def read_current_user_profile(current_user: CurrentUser):
    return current_user


@router.put("/users/me", response_model=UserProfileResponse)
def update_current_user_profile(payload: UserUpdate, current_user: CurrentUser, db: Session = Depends(get_db)):
    duplicate = db.query(User).filter(User.email == payload.email.strip().lower(), User.id != current_user.id).first()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    current_user.full_name = payload.full_name.strip()
    current_user.email = payload.email.strip().lower()
    current_user.phone = payload.phone.strip()
    current_user.location = payload.location.strip()
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/users/me/password")
def update_current_user_password(payload: PasswordUpdate, current_user: CurrentUser, db: Session = Depends(get_db)):
    if not verify_password(payload.current_password, current_user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Your current password is incorrect")
    current_user.password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Your password has been updated"}


@router.get("/users/", response_model=list[UserResponse])
def list_users(current_user: CurrentUser, db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/owners/me")
def read_current_owner_profile(current_user: CurrentUser, db: Session = Depends(get_db)):
    owner = db.query(PropertyOwner).filter(PropertyOwner.user_id == current_user.id).first()
    if owner is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner profile not found")
    return {"id": owner.id, "user_id": owner.user_id, "user": current_user}


@router.get("/hunters/me")
def read_current_hunter_profile(current_user: CurrentUser, db: Session = Depends(get_db)):
    hunter = db.query(HouseHunter).filter(HouseHunter.user_id == current_user.id).first()
    if hunter is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hunter profile not found")
    return {"id": hunter.id, "user_id": hunter.user_id, "user": current_user}
