"""HTTP endpoints for registration, JWT sessions, and the current user."""

import os
from typing import Annotated, TypeAlias

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.dependencies import COOKIE_NAME, get_current_user
from app.auth.schemas import AuthResponse, LoginRequest, RegisterRequest
from app.auth.utils import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.house_hunter import HouseHunter
from app.models.property_owner import PropertyOwner
from app.models.user import User


router = APIRouter()
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser: TypeAlias = Annotated[User, Depends(get_current_user)]
COOKIE_MAX_AGE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")) * 60
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"


def set_auth_cookie(response: Response, token: str) -> None:
    """Store the JWT in an HTTP-only cookie."""
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=COOKIE_MAX_AGE_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/",
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, response: Response, db: DatabaseSession) -> AuthResponse:
    """Create an account and immediately start an authenticated session."""
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    user = User(
        full_name=data.full_name.strip(),
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    try:
        db.flush()
        if user.role == "owner":
            db.add(PropertyOwner(user_id=user.id))
        else:
            db.add(HouseHunter(user_id=user.id))
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    db.refresh(user)

    set_auth_cookie(response, create_access_token(user.id))
    return AuthResponse(user=user, message="Registration successful")


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, response: Response, db: DatabaseSession) -> AuthResponse:
    """Verify credentials and issue an HTTP-only JWT cookie."""
    user = db.query(User).filter(User.email == data.email).first()
    if user is None or not verify_password(data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    set_auth_cookie(response, create_access_token(user.id))
    return AuthResponse(user=user, message="Login successful")


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> Response:
    """Clear the browser authentication cookie."""
    response.delete_cookie(key=COOKIE_NAME, path="/")
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.get("/user", response_model=AuthResponse)
def get_user(current_user: CurrentUser) -> AuthResponse:
    """Return the authenticated user's public profile."""
    return AuthResponse(user=current_user, message="Authenticated user")
