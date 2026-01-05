import ScribeRoutes from "./scribe.routes";
import type { FastifyInstance } from "fastify";

export default async function AuthModule(app: FastifyInstance) {
  app.register(ScribeRoutes, { prefix: "/scribe" });
}
