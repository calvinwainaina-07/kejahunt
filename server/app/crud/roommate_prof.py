from sqlalchemy.orm import Session

from app.models.roommate_profile import RoommateProfile
from app.schemas.roommate_profile import RoommateProfileCreate


def get_profile_by_id(db: Session, profile_id: int):
    return db.query(RoommateProfile).filter(RoommateProfile.id == profile_id).first()


def get_profile_by_user_id(db: Session, user_id: int):
    return db.query(RoommateProfile).filter(RoommateProfile.user_id == user_id).first()


def get_all_profiles(db: Session):
    return db.query(RoommateProfile).all()


def create_or_update_profile(db: Session, user_id: int, data: RoommateProfileCreate):
    profile = get_profile_by_user_id(db, user_id)
    if profile is None:
        profile = RoommateProfile(user_id=user_id)
        db.add(profile)

    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile