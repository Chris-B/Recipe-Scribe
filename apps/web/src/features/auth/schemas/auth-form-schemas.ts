import { z } from "zod"

export const authSigninSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export const authSignupSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter a password")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/\d/, "Password must contain a number"),
});

export const authForgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const authResetPasswordSchema = z.object({
  password: z.string().min(1, "Please enter a password")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/\d/, "Password must contain a number"),
  confirmPassword: z.string().min(1, "Please confirm your password")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type AuthSigninSchema = z.infer<typeof authSigninSchema>
export type AuthSignupSchema = z.infer<typeof authSignupSchema>
export type AuthForgotpasswordSchema = z.infer<typeof authForgotPasswordSchema>
export type AuthResetpasswordSchema = z.infer<typeof authResetPasswordSchema>
