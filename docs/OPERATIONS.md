# Operations and deployment

## Environment configuration

Backend production requirements:

- `NODE_ENV=production`
- `MONGODB_URL`
- `SECRET_KEY` with at least 32 random characters
- `CORS_ORIGINS` as a comma-separated allow-list
- `FRONTEND_URL` for password-reset links
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM` for password recovery

Optional authentication settings are documented in `backend/.env.example`. `API_URL` is the frontend server's backend target and must be available when building the standalone frontend image.

Never commit real environment files. Use the deployment platform's secret manager and rotate any value that may have been exposed.

## Compose deployment

```bash
cp .env.example .env
# Set a new SECRET_KEY and real SMTP credentials
docker compose up --build -d
docker compose ps
docker compose logs -f backend frontend
```

Both application images run as non-root users and expose health checks. MongoDB must become healthy before the backend starts; the backend must become healthy before the frontend starts.

To stop without deleting data:

```bash
docker compose down
```

Do not add `--volumes` unless permanent deletion of MongoDB, profile images, and private documents is intended.

## Data and file persistence

Compose uses three named volumes:

- `mongo-data` for MongoDB
- `profile-uploads` for public profile images
- `private-documents` for access-controlled student documents

Back up all three on the same schedule. A database-only backup is incomplete because document metadata and file content live separately. Test restoration in a non-production environment.

## Deployment checklist

1. Run backend type-check and all tests.
2. Run frontend lint, type-check, and production build.
3. Configure a unique production secret and exact HTTPS origins.
4. Configure and test SMTP password recovery.
5. Provision persistent storage and backups.
6. Build immutable images and scan dependencies/images using the deployment platform.
7. Apply TLS at the ingress or load balancer and forward traffic only to the frontend unless direct API access is required.
8. Verify registration, login/logout, password reset, private document denial, each role dashboard, and health checks.

## Health and logs

- Frontend: `GET /`
- Backend: `GET /` returns the API running response
- Container state: `docker compose ps`
- Logs: `docker compose logs -f backend frontend mongo`

The API handles `SIGTERM` and `SIGINT`, stops accepting requests, disconnects MongoDB, and exits. A ten-second deadline prevents deployments from hanging indefinitely.

## CI

`.github/workflows/ci.yml` runs on pushes and pull requests with Node.js 22:

- Backend clean install, type-check, and 114 integration tests
- Frontend clean install, ESLint, TypeScript, and standalone production build

The integration suite uses an ephemeral in-memory MongoDB and does not need a shared CI database.

## Incident notes

- Suspected secret exposure: rotate the secret immediately, update the secret manager, and restart affected services. Changing `SECRET_KEY` invalidates all sessions.
- SMTP outage: authentication continues to work, but password-reset requests for known users fail and stored reset tokens are cleared.
- Missing document volume: restore it together with a matching database backup to keep metadata and content consistent.
