# EduGlobal

EduGlobal is a full-stack education consultancy platform for students, counsellors, and administrators. The repository contains a Next.js frontend and an Express/MongoDB API.

## Requirements

- Node.js 20 or newer
- npm
- MongoDB running locally or an accessible MongoDB connection string

## Local setup

Create local environment files from the committed templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Replace `SECRET_KEY` with a long random value and configure `MONGODB_URL` for your development database.

Install dependencies in each application:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start the API in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:3000` and proxies API requests to the backend at `http://localhost:4000`.

## Verification

```bash
cd backend
npm run build
npm test -- --runInBand

cd ../frontend
npm run lint
npm run build
```

## Seed data

With the backend environment configured, development data can be loaded with:

```bash
cd backend
npm run seed
```

The seed command replaces records in the configured database. Do not run it against production data.

## Repository layout

- `backend/` — Express REST API, Mongoose models, services, repositories, and integration tests
- `frontend/` — Next.js App Router application and typed API clients

More detailed architecture, endpoint, deployment, and role documentation will be added as the hardening work progresses.
