import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
<<<<<<< HEAD
from app.models import *  # noqa: F403 - imports all SQLAlchemy models before create_all
from app.routers import auth, properties, roommate_profiles, saved_listings, messages, profiles, notification, roommates
=======
from app.models import *

from app.routers import auth
from app.routers import properties
from app.routers import messages
from app.routers import saved_listing
from app.routers import roommate_profile
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KejaHunt API",
    version="1.0.0",
)

frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(properties.router)
<<<<<<< HEAD
app.include_router(roommate_profiles.router)
app.include_router(saved_listings.router)
app.include_router(messages.router)
app.include_router(profiles.router)
app.include_router(notification.router)
app.include_router(roommates.router)

=======
app.include_router(messages.router)
app.include_router(saved_listing.router)
app.include_router(roommate_profile.router)
>>>>>>> 93e38e1c3070dce93159be8e7b4048b851d47602

@app.get("/")
def home():
    return {
        "message": "Welcome to KejaHunt API"
    }
