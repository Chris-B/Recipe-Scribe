import type { FastifyInstance } from "fastify";

export default async function HealthRoutes(healthModule: FastifyInstance) {
  healthModule.route({
    method: ["GET"],
    url: "/health",
    handler: async () => ({ ok: true }),
  });
}