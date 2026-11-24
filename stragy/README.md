# Stragy App

Here is my stragy app, an app that incorporates the functionalities of both Strava and Dragy.
First, create the relevant directories, and then make sure that its all ready to be used.
After creating repos, run: npm install, npm install react react-dom, npm create vite@latest. - In that specific order.
Wiring up the back end: python3 -m venv env (or whatever name you'd like your dependencies to have.)
- pip install flask, pipenv install, pipenv shell, pip requirements > requirements.txt.

After all this is done, we are ready to start coding!

Stragy is a full-stack app that combines ideas from Strava and Dragy. It is built with a Flask backend and a Vite/React frontend.

## Project Overview

This project is split into two main parts:

- Frontend: the user interface built with React and Vite
- Backend: the API and business logic built with Flask

## Recent fix — backend imports

The backend used to fail even to import because it mixed two import
conventions (`app.*` and `stragy.app.*`) while no `stragy` Python package
existed, plus a few empty/unexported modules and some model bugs. That has been
cleaned up, and the whole import chain now works end to end (verified: the app
boots with 33 routes and all 11 tables are created). Every problem and its fix
is documented in **`importfixes.md`** — read it before changing the imports.

Two rules that keep it working:

- Use `app.` imports only (never `stragy.app.`).
- Run the backend from the **repo root**: `app/env/bin/python -m app.run`.

## Folder Structure

A clean project structure looks like this:

```text
stragy/
├── app/                      # Flask backend (Python)
│   ├── server/               # app factory (create_app), config.py, extensions.py, migrations
│   ├── controllers/          # route handlers (+ admin blueprint)
│   ├── models/               # SQLAlchemy models
│   ├── services/             # business logic
│   ├── utils/                # helpers (utcnow, APIError)
│   ├── schemas/              # request/response schemas
│   ├── run.py                # local entry point
│   ├── env/                  # Python virtualenv (backend)
│   └── instance/             # created at runtime (SQLite db file)
├── client/
│   └── stragyfront/          # React + Vite frontend
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
├── importfixes.md            # why the backend imports broke + how they were fixed
└── README.md
```

## Backend layout (where things live in `app/`)

Each part has one clear job:

### `app/server/`
- `app.py` – creates and runs the Flask app (the `create_app` factory) and
  registers both the direct routes (`register_routes`) and the blueprints
  (`register_blueprints`).
- `config.py` – app settings (database URI, secret key, ...).
- `extensions.py` – Flask extensions (`db`, `jwt`, `bcrypt`, `cors`).
- `migrations/` – Alembic migrations.

### `app/controllers/`
Route handlers. `admin.py` exposes the `admin_bp` blueprint; the other
controllers expose plain functions (`create_*` / `list_*`) that
`app/server/app.py` binds directly to the `/api/*` routes.

### `app/models/`
SQLAlchemy models: `users`, `vehicles`, `trips`, `personal_records`,
`route_notes`, `user_driving_statistics`, `clans`, `clan_members`,
`clan_messages`, `posts`, and `follows`.

### `app/services/`
Business logic, kept out of the HTTP layer: `trip_service`, `follow_service`,
`clan_service`.

### `app/utils/`
Helper functions: `utcnow` (`time.py`), `APIError` (`error_handlers.py`),
permissions, decorators, validators.

### `app/schemas/`
Request/response schemas.

## Setup Instructions

### Frontend setup
Run these commands in the correct order:

```bash
npm install
npm install react react-dom
npm create vite@latest
```

### Backend setup

The repo already ships a Python virtualenv at `app/env` with the needed
packages. To recreate it from scratch:

```bash
cd app
python3 -m venv env
app/env/bin/pip install -U pip
app/env/bin/pip install flask flask-sqlalchemy flask-migrate flask-cors \
    flask-jwt-extended flask-bcrypt python-dotenv
pip freeze > requirements.txt
```

Then run the backend **from the repo root** (not from inside `app/`):

```bash
cd /home/bernd-okwiri/Documents/stragy-app/stragy   # repo root
app/env/bin/python -m app.run                       # starts on http://127.0.0.1:5000
```

> `import app` only works from the repo root because `app` is the top-level
> Python package. If you need another port:
> `PORT=5050 app/env/bin/python -m app.run`.

## Development Workflow

After the setup is complete, start building the app in this order:

1. Create the backend (`app/`) structure
2. Set up the Flask app and configuration
3. Add routes and controllers
4. Connect the database models
5. Build the frontend pages
6. Connect frontend to backend API

## Next Step

Keep your app organized by making sure each folder has a single responsibility. This will make the project easier to grow later.

## Some maoni for any kind of future deployment.

- The frontend uses `fetch()` against `/api/*` endpoints in `client/stragyfront/src/App.jsx`.
- During development, `client/stragyfront/vite.config.js` proxies `/api` requests to `http://127.0.0.1:5000`.
- The backend routes in `app/server/app.py` now support both bare and `/api/*` paths, including `/api/auth/login`, `/api/users/vehicles`, `/api/routes`, and `/api/vehicle-search`.
- `/api/vehicle-search` will fetch from an external vehicle catalog when `VEHICLE_CATALOG_API_URL` is set, otherwise it falls back to searching local vehicles.
- This setup keeps the frontend and backend aligned and avoids cross-origin issues when running Vite locally.

### Production deployment note

- When deploying the frontend and backend to different origins, set the frontend environment variable `VITE_API_BASE` to your backend base URL (for example `https://api.example.com`).
- The frontend uses `VITE_API_BASE` at build/runtime to prefix `/api` calls so production requests reach your backend. Leave it empty for local development where the Vite dev server proxy handles `/api`.


N/B: You must be in the stragyfront directory in order to run the front end using vite. 
For example: Documents/stragy-app/stragy/stragyfront. - It's a bit complicated due to the way I set up my repos, but it works. 