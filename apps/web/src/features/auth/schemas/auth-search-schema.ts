import { z } from "zod"

export const authRedirectSchema = z.object({
  authRedirect: z.string().optional(),
});

export const authResetSchema = z.object({
  error: z.string().optional(),
  token: z.string().optional(),
});

export type AuthRedirectSchema = z.infer<typeof authRedirectSchema>;
export type AuthResetSchema = z.infer<typeof authResetSchema>;