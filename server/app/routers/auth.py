from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Authentication endpoints will be implemented by Brigid.