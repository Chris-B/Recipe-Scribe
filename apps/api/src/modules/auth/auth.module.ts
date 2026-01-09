import AuthRoutes from "./auth.routes";
import type { FastifyInstance } from "fastify";

export default async function AuthModule(app: FastifyInstance) {
  app.register(AuthRoutes, { prefix: "/auth" });
}