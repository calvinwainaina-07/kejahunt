"""Compatibility import for authentication code.

The application owns its SQLAlchemy models in ``app.models``.  Keeping this
module as a re-export prevents a second, conflicting users table from being
created by authentication imports.
"""

from app.models.user import User

__all__ = ["User"]
