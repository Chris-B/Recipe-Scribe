# Recipe Scribe (Vite + Fastify + pnpm workspaces)

Modern full-stack AI-assisted recipe scribe for creating and managing recipes.

## Monorepo layout

### `apps/web`
- **Framework**: React 18
- **Build tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data fetching**: TanStack Query
- **Routing**: TanStack Router
- **UI primitives**: Radix UI

### `apps/api`
- **Runtime**: Node.js (ESM)
- **Framework**: Fastify
- **Language**: TypeScript (run in dev via `tsx`)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: `better-auth` (w/ Username + Password or Google OAuth)
- **AI**: OpenAI SDK for recipe generation and enhancement

### `packages/shared`
- **Language**: TypeScript
- **Schema/validation**: Zod
- **Purpose**: shared schemas + helpers consumed by both web + api

## Prereqs
- Node 22+
- pnpm via Corepack
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```

## Local setup (recommended)
```bash
pnpm install
pnpm dev
```

### URLs
- **Web**: http://localhost:5173
- **API**: http://localhost:8787/api/v1
- **Postgres** (local if running via Docker): `localhost:5432`

## Environment variables

This repo uses per-app `.env` files:
- `apps/api/.env`
- `apps/web/.env`

The API container also accepts (optionally) these values from your host environment:
- `OPENAI_API_KEY`
- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Docker (dev)

This repo includes a development Docker workflow that supports:
- Live code mounts (edit locally, run in container)
- A persistent pnpm store volume for faster installs
- Dedicated `node_modules` volumes so host `node_modules` don’t interfere

### Files

#### `Dockerfile.dev`
Builds a Node 22 image with Corepack enabled (for pnpm). It copies the workspace manifests first for caching, runs `pnpm install`, then copies the rest of the repo.

In compose, we still mount the repo into `/app` for live development, and we keep dependencies in named volumes.

#### `docker-compose.yml`
Services:
- **`db`**: Postgres 16 with a healthcheck
- **`deps`**: one-shot container that runs `pnpm install --force` and exits
- **`api`**: Fastify dev server (`pnpm -C apps/api dev`)
- **`web`**: Vite dev server (`pnpm -C apps/web dev --host 0.0.0.0 --port 5173`)

Why `deps` exists: running `pnpm install` concurrently in multiple containers against shared `node_modules` volumes can corrupt installs and cause missing binaries like Vite/tsx. `deps` ensures the workspace install finishes before `api`/`web` start.

### Run with Docker

```bash
docker compose down -v
docker compose up --build
```

### Common troubleshooting

If you see missing module errors (e.g. `.../node_modules/vite/bin/vite.js`):

1. Remove volumes and restart (most common fix)
   ```bash
   docker compose down -v
   docker compose up --build
   ```
2. Inspect the deps install logs
   ```bash
   docker compose logs deps
   ```

## Useful commands

```bash
pnpm -r lint
pnpm -r typecheck
pnpm -r build
```
