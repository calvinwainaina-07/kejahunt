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
    additions_by_table = {
        "roommate_profiles": {
            "age": "INTEGER",
            "traits": "VARCHAR(255) NOT NULL DEFAULT ''",
            "match_percentage": "INTEGER NOT NULL DEFAULT 0",
        },
        "users": {
            "phone": "VARCHAR(32) NOT NULL DEFAULT ''",
            "location": "VARCHAR(100) NOT NULL DEFAULT ''",
        },
        "messages": {
            "sent_at": "DATETIME",
        },
        "viewing_requests": {
            "note": "TEXT NOT NULL DEFAULT ''",
            "status": "VARCHAR(32) NOT NULL DEFAULT 'Pending'",
            "created_at": "DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00'",
        },
        "notifications": {
            "role": "VARCHAR NOT NULL DEFAULT 'hunter'",
            "type": "VARCHAR NOT NULL DEFAULT 'Listing'",
            "title": "VARCHAR NOT NULL DEFAULT ''",
            "message": "VARCHAR NOT NULL DEFAULT ''",
            "to": "VARCHAR",
            "read": "BOOLEAN NOT NULL DEFAULT 0",
            "created_at": "DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00'",
        },
    }
    with engine.begin() as connection:
        for table, additions in additions_by_table.items():
            if not inspector.has_table(table):
                continue
            existing_columns = {column["name"] for column in inspector.get_columns(table)}
            for name, definition in additions.items():
                if name not in existing_columns:
                    connection.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {definition}"))
