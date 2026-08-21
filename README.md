# Eduvance

Adaptive exam-preparation optimizer.

## Apps

- `client/` — React (Vite) frontend
- `client/server/` — Express + MongoDB API (JWT auth, per-user preparation)

## Run locally

Terminal 1 — API (requires MongoDB Atlas URI in `client/server/.env`):

```bash
cd client/server
cp .env.example .env
# set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

Terminal 2 — UI:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:5000/api/health
