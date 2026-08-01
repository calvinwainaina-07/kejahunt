from fastapi import APIRouter, HTTPException, status

from app.auth.dependencies import CurrentUser, DatabaseSession
from app.models.property import Property
from app.models.viewing_request import ViewingRequest
from app.schemas.viewing_request import ViewingRequestCreate, ViewingRequestResponse, ViewingRequestUpdate
from app.services.notif_service import create_notification

router = APIRouter(prefix="/viewings", tags=["Viewings"])


@router.get("/", response_model=list[ViewingRequestResponse])
def list_viewings(current_user: CurrentUser, db: DatabaseSession):
    query = db.query(ViewingRequest)
    if current_user.role == "owner":
        query = query.join(Property).filter(Property.owner.has(user_id=current_user.id))
    else:
        query = query.filter(ViewingRequest.hunter_id == current_user.id)
    return query.order_by(ViewingRequest.created_at.desc()).all()


@router.post("/", response_model=ViewingRequestResponse, status_code=status.HTTP_201_CREATED)
def create_viewing(payload: ViewingRequestCreate, current_user: CurrentUser, db: DatabaseSession):
    if current_user.role != "hunter":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only house hunters can request viewings")
    listing = db.get(Property, payload.property_id)
    if listing is None or not listing.available:
        raise HTTPException(status_code=404, detail="Available property not found")
    viewing = ViewingRequest(hunter_id=current_user.id, **payload.model_dump())
    db.add(viewing)
    db.commit()
    db.refresh(viewing)
    create_notification(
        db, user_id=listing.owner.user_id, role="owner", type="Viewing",
        title="New viewing request", message=f"{current_user.full_name} requested a viewing for {listing.title}.", to="/bookings",
    )
    return viewing


@router.patch("/{viewing_id}", response_model=ViewingRequestResponse)
def update_viewing(viewing_id: int, payload: ViewingRequestUpdate, current_user: CurrentUser, db: DatabaseSession):
    viewing = db.get(ViewingRequest, viewing_id)
    if viewing is None:
        raise HTTPException(status_code=404, detail="Viewing request not found")
    if current_user.role != "owner" or viewing.listing.owner.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot update this viewing request")
    if viewing.status != "Pending":
        raise HTTPException(status_code=409, detail="This viewing request has already been handled")
    viewing.status = payload.status
    db.commit()
    db.refresh(viewing)
    create_notification(
        db, user_id=viewing.hunter_id, role="hunter", type="Viewing",
        title=f"Viewing {payload.status.lower()}",
        message=f"Your viewing request for {viewing.listing.title} was {payload.status.lower()}.", to="/bookings",
    )
    return viewing
