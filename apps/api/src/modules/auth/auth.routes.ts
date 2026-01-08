import { auth } from "./auth.lib";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function AuthRoutes(authModule: FastifyInstance) {
  authModule.route({
    method: ["GET", "POST"],
    url: "/*",
    handler: AuthController,
  });
}

const AuthController = async (request: FastifyRequest, reply: FastifyReply)=> {
  try {
    // Construct request URL
    const url = new URL(request.url, `http://${request.headers.host}`);

    // Convert Fastify headers to standard Headers object
    const headers = new Headers();
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString());
    });
    // Create Fetch API-compatible request
    const req = new Request(url.toString(), {
      method: request.method,
      headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
    });
    // Process authentication request
    const response = await auth.handler(req);

    const responseBodyText = response.body ? await response.text() : null;

    if (response.status >= 400) {
      request.log.warn(
        {
          auth: {
            status: response.status,
            request: {
              method: request.method,
              url: request.url,
              rawUrl: request.raw.url,
            },
            response: {
              contentType: response.headers.get("content-type"),
              body: responseBodyText,
            },
          },
        },
        "Better Auth handler returned error response"
      );
    }

    // Forward response to client
    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    reply.send(responseBodyText);
  } catch (error) {
    request.log.error(error, "Authentication Error:");
    reply.status(500).send({
      error: "Internal authentication error",
      code: "AUTH_FAILURE",
    });
  }
}