from sqlalchemy.orm import Session, selectinload

from app.models.roommate_profile import RoommateProfile
from app.schemas.roommate_profile import (
    RoommateProfileCreate,
    RoommateProfileUpdate,
)


def create_roommate_profile(
    db: Session,
    profile_data: RoommateProfileCreate,
    user_id: int
):
    profile = RoommateProfile(
        user_id=user_id,
        age=profile_data.age,
        budget=profile_data.budget,
        preferred_location=profile_data.preferred_location,
        occupation=profile_data.occupation,
        lifestyle=profile_data.lifestyle,
        traits=profile_data.traits,
        bio=profile_data.bio,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


def get_all_roommate_profiles(db: Session):
    return db.query(RoommateProfile).options(selectinload(RoommateProfile.user)).all()


def get_roommate_profile(
    db: Session,
    profile_id: int
):
    return (
        db.query(RoommateProfile)
        .options(selectinload(RoommateProfile.user))
        .filter(RoommateProfile.id == profile_id)
        .first()
    )


def update_roommate_profile(
    db: Session,
    profile_id: int,
    profile_data: RoommateProfileUpdate
):
    profile = get_roommate_profile(db, profile_id)

    if profile:
        profile.age = profile_data.age
        profile.budget = profile_data.budget
        profile.preferred_location = profile_data.preferred_location
        profile.occupation = profile_data.occupation
        profile.lifestyle = profile_data.lifestyle
        profile.traits = profile_data.traits
        profile.bio = profile_data.bio

        db.commit()
        db.refresh(profile)

    return profile


def delete_roommate_profile(
    db: Session,
    profile_id: int
):
    profile = get_roommate_profile(db, profile_id)

    if profile:
        db.delete(profile)
        db.commit()

    return profile
