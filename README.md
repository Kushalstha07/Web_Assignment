# EduGlobal

EduGlobal is an education consultancy platform with separate workspaces for students, counsellors, and administrators.

## Requirements

- Node.js 22
- npm
- MongoDB

## Local setup

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

cd backend
npm ci

cd ../frontend
npm ci
```

Configure the database and replace `SECRET_KEY` in `backend/.env`. Start the backend and frontend in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:3000` and the API runs at `http://localhost:4000`.

## Checks

```bash
cd backend
npm run typecheck
npm run test:ci

cd ../frontend
npm run lint
npm run typecheck
npm run build
```

## Docker

```bash
cp .env.example .env
docker compose up --build -d
```

Set a new `SECRET_KEY` and real SMTP credentials in `.env` before starting the containers.

## Seed data

```bash
cd backend
npm run seed
```

The seed command replaces data in the configured database.

## Structure

- `backend/` — Express API, MongoDB models, services, repositories, and tests
- `frontend/` — Next.js application and API clients
- `docker-compose.yml` — local container stack
