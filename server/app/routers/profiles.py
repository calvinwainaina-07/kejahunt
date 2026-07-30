from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.house_hunter import HouseHunter
from app.models.property_owner import PropertyOwner
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(tags=["Profiles"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/users/me", response_model=UserResponse)
def read_current_user_profile(current_user: CurrentUser):
    return current_user


@router.get("/users/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
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
