import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { authRoute } from "./routes/auth";
import { authenticatedRoute } from "./routes/_authenticated";
import { dashboardRoute } from "./routes/_authenticated.index";
import { aanvragenListRoute } from "./routes/_authenticated.aanvragen.index";
import { aanvragenNieuwRoute } from "./routes/_authenticated.aanvragen.nieuw";
import { aanvraagDetailRoute } from "./routes/_authenticated.aanvragen.$id";
import { klantenListRoute } from "./routes/_authenticated.klanten.index";
import { klantNieuwRoute } from "./routes/_authenticated.klanten.nieuw";
import { klantDetailRoute } from "./routes/_authenticated.klanten.$id";
import { dossierNieuwRoute } from "./routes/_authenticated.klanten.$id.dossiers.nieuw";
import { dossierDetailRoute } from "./routes/_authenticated.dossiers.$id";
import { dossierAanvraagNieuwRoute } from "./routes/_authenticated.dossiers.$id.aanvragen.nieuw";
import { begeleiderRoute } from "./routes/_begeleider";
import { begeleiderDossiersListRoute } from "./routes/_begeleider.index";
import { begeleiderDossierDetailRoute } from "./routes/_begeleider.dossiers.$id";

const routeTree = rootRoute.addChildren([
  authRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    klantenListRoute,
    klantNieuwRoute,
    klantDetailRoute,
    dossierNieuwRoute,
    dossierDetailRoute,
    dossierAanvraagNieuwRoute,
    aanvragenListRoute,
    aanvragenNieuwRoute,
    aanvraagDetailRoute,
  ]),
  begeleiderRoute.addChildren([begeleiderDossiersListRoute, begeleiderDossierDetailRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
