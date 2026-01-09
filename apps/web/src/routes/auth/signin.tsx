import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { authClient } from "@/features/auth/lib/auth-client"
import { authRedirectSchema } from "@/features/auth/schemas/auth-search-schemas"
import { SignInPage } from "@/features/auth/pages/signin-page"

export const Route = createFileRoute('/auth/signin')({
  validateSearch: authRedirectSchema,
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (data?.user) {
      throw redirect({ to: "/" })
    }
  },
  component: SignInPage,
})
