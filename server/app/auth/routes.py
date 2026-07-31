"""Compatibility import for the authentication API router.

HTTP endpoint definitions live in ``app.routers.auth``.  JWT-related support
code belongs in this package alongside this module.
"""

from app.routers.auth import router

__all__ = ["router"]
