from fastapi import FastAPI

from app.database import Base, engine
from app.models import *

from app.routers import auth
from app.routers import properties
from app.routers import messages
from app.routers import saved_listing
from app.routers import roommate_profile

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KejaHunt API",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(messages.router)
app.include_router(saved_listing.router)
app.include_router(roommate_profile.router)

@app.get("/")
def home():
    return {
        "message": "Welcome to KejaHunt API"
    }