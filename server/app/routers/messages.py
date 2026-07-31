from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.message import MessageCreate, MessageResponse
from app.crud.message import (
    create_message,
    get_all_messages,
    get_message,
    get_property_messages,
    delete_message,
)

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.get("/", response_model=list[MessageResponse])
def read_messages(db: Session = Depends(get_db)):
    return get_all_messages(db)


@router.get("/{message_id}", response_model=MessageResponse)
def read_message(
    message_id: int,
    db: Session = Depends(get_db),
):
    message = get_message(db, message_id)

    if message is None:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    return message


@router.get("/property/{property_id}", response_model=list[MessageResponse])
def read_property_messages(
    property_id: int,
    db: Session = Depends(get_db),
):
    return get_property_messages(db, property_id)


@router.post("/", response_model=MessageResponse, status_code=201)
def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
):
    # Temporary sender ID until authentication is implemented
    sender_id = 1

    return create_message(
        db,
        message,
        sender_id,
    )


@router.delete("/{message_id}")
def remove_message(
    message_id: int,
    db: Session = Depends(get_db),
):
    deleted_message = delete_message(db, message_id)

    if deleted_message is None:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    return {
        "message": "Message deleted successfully"
    }