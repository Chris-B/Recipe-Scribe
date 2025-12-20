# Recipe AI Starter (Vite + Fastify + pnpm workspaces)

Monorepo template:
- `apps/web`: Vite + React + TS + Tailwind + TanStack Query
- `apps/api`: Fastify + TS + SSE endpoint + OpenAI placeholder wiring
- `packages/shared`: Shared Zod schemas + unit conversion helpers

## Prereqs
- Node 22+
- pnpm (`corepack enable` then `corepack prepare pnpm@latest --activate`)

## Setup
```bash
pnpm install
pnpm dev
```

Web: http://localhost:5173  
API: http://localhost:8787
