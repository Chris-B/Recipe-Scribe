import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "../../lib/db";
import { resend } from "../../lib/email/email";

export const auth = betterAuth({
  basePath: "/api/v1/auth",
  trustedOrigins: [process.env.CORS_ORIGIN as string],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url, token}, request) => {
      const webOrigin = process.env.CORS_ORIGIN;
      const resetUrl = webOrigin
        ? `${webOrigin}/auth/resetpassword?token=${encodeURIComponent(token)}`
        : url;

      await resend.emails.send({
        from: "Recipe Scribe <noreply@emails.chrisbarclay.dev>",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});