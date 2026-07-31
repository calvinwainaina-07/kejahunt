from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.crud import roommate_prof as roommate_prof_crud
from app.database import get_db
from app.models.roommate_connection import RoommateConnection
from app.models.user import User
from app.services.notif_service import create_notification

router = APIRouter(prefix="/roommates", tags=["Roommates"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/{profile_id}/connect", status_code=status.HTTP_204_NO_CONTENT)
def connect_with_roommate(
    profile_id: int,
    current_user: CurrentUser,
    db: Session = Depends(get_db),
):
    target_profile = roommate_prof_crud.get_profile_by_id(db, profile_id)
    if target_profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roommate profile not found")

    if target_profile.user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot connect with yourself")

    existing = (
        db.query(RoommateConnection)
        .filter(
            RoommateConnection.requester_id == current_user.id,
            RoommateConnection.target_id == target_profile.user_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You already connected with this person")

    db.add(RoommateConnection(requester_id=current_user.id, target_id=target_profile.user_id))
    db.commit()

    create_notification(
        db,
        user_id=target_profile.user_id,
        role="hunter",
        type="Roommate",
        title=f"{current_user.full_name} wants to room with you",
        message=f"{current_user.full_name} chose you as a potential roommate",
        to="/roommates",
    )
