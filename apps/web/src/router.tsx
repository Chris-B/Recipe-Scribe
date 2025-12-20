import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Required for TS inference
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
