from fastapi import APIRouter, HTTPException, status

from app.auth.dependencies import CurrentUser, DatabaseSession
from app.crud.message import create_message
from app.models.message import Message
from app.models.property import Property
from app.models.user import User
from app.schemas.message import MessageCreate, MessageResponse
from app.services.notif_service import create_notification

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/", response_model=list[MessageResponse])
def list_messages(current_user: CurrentUser, db: DatabaseSession):
    return db.query(Message).filter(
        (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
    ).order_by(Message.sent_at.asc()).all()


@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(payload: MessageCreate, current_user: CurrentUser, db: DatabaseSession):
    if payload.receiver_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot message yourself")
    recipient = db.get(User, payload.receiver_id)
    listing = db.get(Property, payload.property_id)
    if recipient is None or listing is None:
        raise HTTPException(status_code=404, detail="Recipient or property not found")
    message = create_message(db, payload, current_user.id)
    create_notification(db, user_id=recipient.id, role=recipient.role, type="Message", title="New message", message=payload.message, to="/messages")
    return message


@router.delete("/{message_id}")
def remove_message(message_id: int, current_user: CurrentUser, db: DatabaseSession):
    """Allow a user to permanently remove a message they sent."""
    message = db.get(Message, message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    if message.sender_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete messages you sent")
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}
