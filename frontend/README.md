# TalentLens Frontend

Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui.

## Setup

```bash
cd frontend
cp .env.local.example .env.local
npm install
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` (default `http://localhost:8000`). Start the FastAPI backend first (`uvicorn backend.main:app --port 8000`). Ensure `FRONTEND_ORIGINS` on the API includes `http://localhost:3000` for CORS.

## Dev

```bash
npm run dev
```

Open [http://localhost:3000/talentlens](http://localhost:3000/talentlens) (`basePath` is `/talentlens`).

## Build

```bash
npm run build
npm start
```
