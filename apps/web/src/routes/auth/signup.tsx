import { createFileRoute, redirect } from "@tanstack/react-router"
import { authClient } from "@/features/auth/lib/auth-client"
import { authRedirectSchema } from "@/features/auth/schemas/auth-search-schema"
import { SignUpPage } from "@/features/auth/pages/signup-page"

export const Route = createFileRoute('/auth/signup')({
  validateSearch: authRedirectSchema,
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (data?.user) {
      throw redirect({ to: "/" })
    }
  },
  component: SignUpPage,
})