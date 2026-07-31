import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load local configuration before importing modules that read environment values
# during initialization (notably the database connection).
load_dotenv()

from app.database import Base, apply_sqlite_migrations, engine
from app.models import *  # noqa: F403 - imports all SQLAlchemy models before create_all
from app.routers import auth, properties, roommate_profile, saved_listings, messages, profiles, notification, roommates, viewings

apply_sqlite_migrations()
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
app.include_router(roommate_profile.router)
app.include_router(saved_listings.router)
app.include_router(messages.router)
app.include_router(profiles.router)
app.include_router(notification.router)
app.include_router(roommates.router)
app.include_router(viewings.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to KejaHunt API"
    }
