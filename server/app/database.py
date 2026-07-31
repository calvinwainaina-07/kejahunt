import os

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kejahunt.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def apply_sqlite_migrations() -> None:
    """Apply additive schema updates needed by existing local SQLite files.

    ``create_all`` creates new tables but does not add columns to a table that
    already exists. These additions preserve all local accounts and profiles.
    """
    if engine.dialect.name != "sqlite":
        return

    inspector = inspect(engine)
    if not inspector.has_table("roommate_profiles"):
        return

    existing_columns = {column["name"] for column in inspector.get_columns("roommate_profiles")}
    additions = {
        "age": "INTEGER",
        "traits": "VARCHAR(255) NOT NULL DEFAULT ''",
        "match_percentage": "INTEGER NOT NULL DEFAULT 0",
    }
    with engine.begin() as connection:
        for name, definition in additions.items():
            if name not in existing_columns:
                connection.execute(text(f"ALTER TABLE roommate_profiles ADD COLUMN {name} {definition}"))

        if inspector.has_table("users"):
            user_columns = {column["name"] for column in inspector.get_columns("users")}
            for name, definition in {
                "phone": "VARCHAR(32) NOT NULL DEFAULT ''",
                "location": "VARCHAR(100) NOT NULL DEFAULT ''",
            }.items():
                if name not in user_columns:
                    connection.execute(text(f"ALTER TABLE users ADD COLUMN {name} {definition}"))
