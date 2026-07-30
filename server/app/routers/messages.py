from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.message import Message
from app.models.property import Property
from app.models.user import User
from app.schemas.message import MessageCreate, MessageResponse

router = APIRouter(prefix="/messages", tags=["Messages"])
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/", response_model=list[MessageResponse])
def read_messages(current_user: CurrentUser, db: Session = Depends(get_db)):
    return (
        db.query(Message)
        .filter((Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id))
        .order_by(Message.sent_at.desc())
        .all()
    )


@router.post("/", response_model=MessageResponse)
def create_message(data: MessageCreate, current_user: CurrentUser, db: Session = Depends(get_db)):
    if data.receiver_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot message yourself")

    property = db.get(Property, data.property_id)
    if property is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    receiver = db.get(User, data.receiver_id)
    if receiver is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receiver not found")

    message = Message(
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        property_id=data.property_id,
        message=data.message,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
