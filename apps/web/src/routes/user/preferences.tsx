import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/features/auth/lib/auth-client";
import { PreferencesPage } from "@/features/user/preferences/pages/preferences-page";

export const Route = createFileRoute("/user/preferences")({
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data?.user) {
      throw redirect({
        to: "/auth/signin",
        search: {
          authRedirect: "/user/preferences",
        },
      })
    }
  },
  component: PreferencesPage,
});
