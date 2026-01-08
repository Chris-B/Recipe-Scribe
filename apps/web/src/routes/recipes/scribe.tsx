import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/features/auth/lib/auth-client";
import { ScribePage } from "@/features/recipes/scribe/pages/scribe-page";

export const Route = createFileRoute("/recipes/scribe")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data?.user) {
      throw redirect({
        to: "/auth/signin",
        search: {
          authRedirect: "/recipes/scribe",
        },
      })
    }
  },
  component: ScribePage,
});
