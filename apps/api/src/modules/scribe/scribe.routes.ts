import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { gptNormalize, gptUpdate } from "./scribe.service";
import { NormalizeRequestSchema, UpdateRequestSchema } from "./scribe.schemas";
import { z } from "zod";

export default async function ScribeRoute(scribeModule: FastifyInstance) {
  scribeModule.route({
    method: ["POST"],
    url: "/normalize",
    handler: ScribeNormalizeController,
  });
  scribeModule.route({
    method: ["POST"],
    url: "/update",
    handler: ScribeUpdateController,
  });
}

const ScribeNormalizeController = async (request: FastifyRequest, reply: FastifyReply)=> {
  const body = NormalizeRequestSchema.safeParse(request.body);
  if (!body.success) {
    reply.code(400);
    return { error: z.treeifyError(body.error) };
  }

  return await gptNormalize({
    recipeRaw: body.data,
  });
}

const ScribeUpdateController = async (request: FastifyRequest, reply: FastifyReply)=> {
  const body = UpdateRequestSchema.safeParse(request.body);
  if (!body.success) {
    reply.code(400);
    return { error: z.treeifyError(body.error) };
  }

  return await gptUpdate({
    recipeUpdate: body.data,
  });
}
