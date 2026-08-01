import os
from typing import Annotated
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.auth.utils import decode_access_token, TokenValidationError

COOKIE_NAME = os.getenv("JWT_COOKIE_NAME", "access_token")


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    # The frontend stores the token returned by the latest sign-in. Prefer it
    # over a cookie so a stale cross-site cookie cannot restore an older
    # account (for example, an owner session after registering as a hunter).
    authorization = request.headers.get("Authorization", "")
    scheme, _, bearer_token = authorization.partition(" ")
    token = bearer_token if scheme.lower() == "bearer" and bearer_token else request.cookies.get(COOKIE_NAME)
    if token is None:
        raise credentials_exception

    try:
        user_id = decode_access_token(token)
    except TokenValidationError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def require_role(*allowed_roles: str):
    """
    Dependency factory for endpoints that should only be hit by one role,
    e.g. Depends(require_role("owner")).
    """
    def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Not permitted for this role")
        return current_user
    return _check


# Shared aliases so every router can do `current_user: CurrentUser` and
# `db: DatabaseSession` instead of repeating Depends(...) everywhere - same
# pattern already used for CurrentUser in the auth router.
CurrentUser = Annotated[User, Depends(get_current_user)]
DatabaseSession = Annotated[Session, Depends(get_db)]
