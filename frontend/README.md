# EduGlobal frontend

The frontend is a Next.js 16 App Router application for the student, counsellor, and administrator portals.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

Copy `.env.example` to `.env.local`. `API_URL` controls the server-side rewrite destination for `/api/v1/*` and `/uploads/*`; it defaults to `http://localhost:4000`. Browser API calls stay same-origin so secure cookies work without exposing tokens to JavaScript.

The production build uses Next.js standalone output and is packaged by the included `Dockerfile`. Project-wide setup, access rules, and deployment instructions are maintained in the root documentation.
