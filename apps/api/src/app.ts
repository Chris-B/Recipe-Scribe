import Fastify, { type FastifyInstance } from "fastify";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export default async function buildApp() {
  const app = Fastify({ logger: true });
  await registerCors(app);
  await registerModules(app);
  return app;
}

async function registerCors(app: FastifyInstance) {
  app.register(cors, {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function registerModules(app: FastifyInstance) {
  await app.register(autoload, {
    dir: join(__dirname, "modules"),
    maxDepth: 1,
    dirNameRoutePrefix: false,
    matchFilter: (filePath) => filePath.endsWith(".module.ts"),
    options: { prefix: "/api/v1" },
  });
}