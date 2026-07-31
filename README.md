# KejaHunt

KejaHunt is a full-stack house-listing platform for property owners and house hunters. The React frontend communicates with a FastAPI backend using authenticated JSON API requests.

## Stack

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, SQLite
- Authentication: JWT stored in an HTTP-only cookie

## Run locally

Start the API from the `server` directory:

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

In a second terminal, start the frontend:

```bash
cd client
npm install
npm run dev
```

The frontend defaults to `http://127.0.0.1:8000`. To use another API location, create `client/.env` with:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For cookie-based authentication in another frontend origin, configure the backend before starting it:

```bash
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173 uvicorn app.main:app --reload
```

## API-connected features

The frontend uses `client/src/api.js` as its shared API client. It includes JSON headers, sends credentials, and surfaces backend error messages.

| Feature | API routes |
| --- | --- |
| Registration, login, logout, session | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/user` |
| Account profile and password | `/users/me`, `/users/me/password` |
| Property discovery and owner listings | `/properties` |
| Saved listings | `/saved-listings` |
| Roommate profile and connections | `/roommates`, `/roommates/me`, `/roommates/{profile_id}/connect` |
| Messages | `/messages` |
| Notifications | `/notifications`, `/notifications/unread-count` |

Interactive API documentation is available at `http://127.0.0.1:8000/docs` while the backend is running.

## Current limitation

The booking/viewing screen is currently a UI prototype backed by browser state. A persistent viewing-request model and API endpoints have not been added to the backend yet.

## Verification

Run frontend checks from `client`:

```bash
npm run lint
npm run build
```

Run backend tests from `server` after installing dependencies:

```bash
pytest -q
```
