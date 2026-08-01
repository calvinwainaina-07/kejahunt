"""Password and JWT helpers used by authentication endpoints."""

from datetime import UTC, datetime, timedelta
import os

import bcrypt
import jwt
from jwt import InvalidTokenError


JWT_ALGORITHM = "HS256"
# Keep a normal returning user signed in for 30 days.  Account and listing
# data remains in the database indefinitely; this value only controls how
# often the browser needs to sign in again.
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 30)))


class TokenValidationError(Exception):
    """Raised when a token cannot be trusted or has expired."""


def _jwt_secret() -> str:
    """Read the secret at call time so test environments can override it."""
    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET must be set before issuing or validating tokens")
    return secret


def hash_password(password: str) -> str:
    """Return a bcrypt hash; never store the plaintext password."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Safely compare a plaintext password with its stored bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (TypeError, ValueError):
        return False


def create_access_token(user_id: int, expires_delta: timedelta | None = None) -> str:
    """Create a signed access token whose subject is the user's id."""
    now = datetime.now(UTC)
    expires_at = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"sub": str(user_id), "iat": now, "exp": expires_at}
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> int:
    """Validate a token and return its user id."""
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not isinstance(user_id, str) or not user_id.isdigit():
            raise TokenValidationError("Token has an invalid subject")
        return int(user_id)
    except InvalidTokenError as exc:
        raise TokenValidationError("Token is invalid or expired") from exc
