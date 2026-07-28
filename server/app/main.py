from fastapi import FastAPI

from app.database import Base, engine
from app.models import *

from app.routers import auth
from app.routers import properties

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KejaHunt API",
    version="1.0.0"
)

app.include_router(auth.router)
app.include_router(properties.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to KejaHunt API"
    }