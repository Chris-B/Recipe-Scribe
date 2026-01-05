import type { FastifyInstance } from "fastify";
import HealthRoutes from "./health.routes";

export default async function HealthModule(app: FastifyInstance) {
  app.register(HealthRoutes);
}