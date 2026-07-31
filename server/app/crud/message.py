from sqlalchemy.orm import Session

from app.models.message import Message
from app.schemas.message import MessageCreate


def create_message(
    db: Session,
    message_data: MessageCreate,
    sender_id: int,
):
    """
    Create a new message.
    """

    new_message = Message(
        sender_id=sender_id,
        receiver_id=message_data.receiver_id,
        property_id=message_data.property_id,
        message=message_data.message,
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message


def get_all_messages(db: Session):
    """
    Retrieve all messages.
    """

    return db.query(Message).all()


def get_message(
    db: Session,
    message_id: int,
):
    """
    Retrieve a single message by ID.
    """

    return (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )


def get_property_messages(
    db: Session,
    property_id: int,
):
    """
    Retrieve all messages for a specific property.
    """

    return (
        db.query(Message)
        .filter(Message.property_id == property_id)
        .all()
    )


def delete_message(
    db: Session,
    message_id: int,
):
    """
    Delete a message.
    """

    message = get_message(db, message_id)

    if message is None:
        return None

    db.delete(message)
    db.commit()

    return message