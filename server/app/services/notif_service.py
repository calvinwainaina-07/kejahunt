from typing import Optional
from sqlalchemy.orm import Session

from app.models.notifications import Notification


def create_notification(
    db: Session,
    *,
    user_id: int,
    role: str,
    type: str,
    title: str,
    message: str,
    to: Optional[str] = None,
) -> Notification:
    """
    Call this from wherever an event happens that should notify someone -
    e.g. after a viewing is booked, a message is sent, a listing is saved,
    or a roommate match is found. Not exposed as a public HTTP endpoint.
    """
    notification = Notification(
        user_id=user_id, role=role, type=type, title=title, message=message, to=to,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification