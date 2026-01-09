import { auth } from "../auth/auth.lib";
import { prisma } from "../../lib/db";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserPreferencesUpdateSchema } from "@recipe/shared";

export default async function PreferencesRoutes(preferencesModule: FastifyInstance) {
  preferencesModule.route({
    method: ["GET"],
    url: "/",
    handler: PreferencesFetchController,
  });
  preferencesModule.route({
    method: ["PATCH"],
    url: "/",
    handler: PreferencesUpdateController,
  });
}

const PreferencesFetchController = async (request: FastifyRequest, reply: FastifyReply)=> {
  const session = await auth.api.getSession({ headers: new Headers(request.headers as HeadersInit) });
  if (!session?.user) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
  
  const prefs = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });
  if (!prefs) return {};
  const { id, userId, createdAt, updatedAt, ...preferences } = prefs;
  return preferences;
}

const PreferencesUpdateController = async (request: FastifyRequest, reply: FastifyReply)=> {
  const session = await auth.api.getSession({ headers: new Headers(request.headers as HeadersInit) });
  if (!session?.user) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
  
  const updates = UserPreferencesUpdateSchema.parse(request.body);
  const existing = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });

  const mergeCategory = <T extends object>(existing: T | null | undefined, update: T | undefined): T | undefined => {
    if (update === undefined) return existing ?? undefined;
    return { ...(existing ?? {} as T), ...update };
  };

  const merged = {
    scribe: mergeCategory(existing?.scribe as object | null, updates.scribe),
    dietary: mergeCategory(existing?.dietary as object | null, updates.dietary),
    discovery: mergeCategory(existing?.discovery as object | null, updates.discovery),
    library: mergeCategory(existing?.library as object | null, updates.library),
    social: mergeCategory(existing?.social as object | null, updates.social),
    cooking: mergeCategory(existing?.cooking as object | null, updates.cooking),
    notifications: mergeCategory(existing?.notifications as object | null, updates.notifications),
    privacy: mergeCategory(existing?.privacy as object | null, updates.privacy),
  };

  const prefs = await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...merged },
    update: merged,
  });
  
  const { id, userId, createdAt, updatedAt, ...preferences } = prefs;
  return preferences;
}