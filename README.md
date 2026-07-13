# EduGlobal

EduGlobal is a full-stack education consultancy platform for students, counsellors, and administrators. It combines a Next.js portal with an Express/MongoDB API and supports the complete journey from academic onboarding through applications and visa processing.

## What is included

- Student onboarding, profile strength, university catalogue, explainable recommendations, applications, documents, appointments, messages, notifications, and visa tracking
- Counsellor workspace for assigned students, applications, appointments, messages, and visa cases
- Administrator workspaces for users, counsellors, universities, scholarships, applications, document verification, analytics, appointments, visa cases, and reporting
- HTTP-only cookie sessions, role and record-level authorization, rate-limited authentication, hashed single-use password resets, private document storage, and security headers
- 114 backend integration tests, frontend lint/type/build gates, GitHub Actions CI, Docker images, health checks, and Compose deployment

## Quick start

Requirements: Node.js 22, npm, and MongoDB.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

cd backend && npm ci
cd ../frontend && npm ci
```

Replace `SECRET_KEY` in `backend/.env` with a random value of at least 32 characters and configure MongoDB. Then run the applications in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The portal is available at `http://localhost:3000`; the API and health endpoint are at `http://localhost:4000`.

## Docker Compose

Docker Desktop or another Docker engine must be running.

```bash
cp .env.example .env
# Replace SECRET_KEY and SMTP placeholders in .env
docker compose up --build -d
docker compose ps
```

Compose starts the frontend, backend, and MongoDB with persistent volumes for database data, public profile images, and private documents. Never use the example secrets in a deployed environment.

## Quality checks

```bash
cd backend
npm run typecheck
npm run test:ci

cd ../frontend
npm run lint
npm run typecheck
npm run build
```

GitHub Actions runs the same checks for every push and pull request.

## Seed data

```bash
cd backend
npm run seed
```

The seed command replaces records in the configured database. Never run it against production data.

## Documentation

- [Architecture and access model](docs/ARCHITECTURE.md)
- [Operations and deployment](docs/OPERATIONS.md)
- [API overview](docs/API.md)

## Repository layout

- `backend/` — Express API, MongoDB models, services, repositories, private file handling, and integration tests
- `frontend/` — Next.js App Router portal and typed API clients
- `.github/workflows/ci.yml` — continuous integration gates
- `docker-compose.yml` — frontend, backend, MongoDB, health checks, and persistent volumes

Environment files, uploads, generated builds, coverage reports, and dependencies are ignored by Git. If a secret is ever committed or exposed, rotate it rather than only deleting the file.
