import PreferencesRoutes from "./preferences.routes";
import type { FastifyInstance } from "fastify";

export default async function PreferencesModule(app: FastifyInstance) {
  app.register(PreferencesRoutes, { prefix: "/user/preferences" });
}