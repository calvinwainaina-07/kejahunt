"""Dependencies shared by endpoints that require an authenticated user."""

from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

# Integration point: your database teammate should expose this function.
from app.database import get_db
from app.models.user import User
from app.auth.utils import TokenValidationError, decode_access_token


COOKIE_NAME = "access_token"
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    access_token: Annotated[str | None, Cookie()] = None,
    bearer_credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)] = None,
) -> User:
    # Return the signed-in user from an HTTP-only cookie or Bearer token.
    token = access_token or (bearer_credentials.credentials if bearer_credentials else None)
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication is required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_error

    try:
        user_id = decode_access_token(token)
    except TokenValidationError:
        raise credentials_error

    user = db.get(User, user_id)
    if user is None:
        raise credentials_error
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
