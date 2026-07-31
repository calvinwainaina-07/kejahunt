from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, HTTPException

from app.auth.dependencies import CurrentUser, DatabaseSession
from app.models.notifications import Notification
from app.schemas.notification_schema import NotificationOut, MarkReadRequest

router = APIRouter(prefix="/notifications", tags=["notifications"])


def _humanize(dt: datetime) -> str:
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    seconds = (now - dt).total_seconds()
    if seconds < 60:
        return "Just now"
    if seconds < 3600:
        return f"{int(seconds // 60)}m ago"
    if seconds < 86400:
        return f"{int(seconds // 3600)}h ago"
    return f"{int(seconds // 86400)}d ago"


def _serialize(n: Notification) -> NotificationOut:
    return NotificationOut(
        id=n.id, type=n.type, title=n.title, message=n.message,
        to=n.to, read=n.read, time=_humanize(n.created_at),
    )


@router.get("", response_model=List[NotificationOut])
def list_notifications(current_user: CurrentUser, db: DatabaseSession):
    # Role is taken from the authenticated user's JWT, never from the client,
    # so a hunter can never fetch an owner's notifications and vice versa.
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.role == current_user.role)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [_serialize(n) for n in notifications]


@router.get("/unread-count")
def unread_count(current_user: CurrentUser, db: DatabaseSession):
    count = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.role == current_user.role,
            Notification.read.is_(False),
        )
        .count()
    )
    return {"unread": count}


@router.patch("/{notification_id}/read", response_model=NotificationOut)
def mark_read(notification_id: int, current_user: CurrentUser, db: DatabaseSession):
    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.user_id == current_user.id)
        .first()
    )
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.read = True
    db.commit()
    db.refresh(notification)
    return _serialize(notification)


@router.patch("/read-all")
def mark_all_read(
    current_user: CurrentUser,
    db: DatabaseSession,
    payload: Optional[MarkReadRequest] = None,
):
    query = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.role == current_user.role,
    )
    if payload and payload.ids:
        query = query.filter(Notification.id.in_(payload.ids))
    updated = query.update({"read": True}, synchronize_session=False)
    db.commit()
    return {"updated": updated}