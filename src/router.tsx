import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { authRoute } from "./routes/auth";
import { authenticatedRoute } from "./routes/_authenticated";
import { dashboardRoute } from "./routes/_authenticated.index";
import { aanvragenListRoute } from "./routes/_authenticated.aanvragen.index";
import { aanvragenNieuwRoute } from "./routes/_authenticated.aanvragen.nieuw";
import { aanvraagDetailRoute } from "./routes/_authenticated.aanvragen.$id";

const routeTree = rootRoute.addChildren([
  authRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    aanvragenListRoute,
    aanvragenNieuwRoute,
    aanvraagDetailRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
