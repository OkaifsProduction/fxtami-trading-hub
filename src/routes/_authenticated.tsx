import { createRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { checkBegeleiderProfiel } from "@/lib/begeleiderQueries";
import { useLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AppFooter } from "@/components/AppFooter";
import amiLegalLogoIcon from "@/assets/ami-legal-logo-icon.png";

export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth" });
    }
    // Begeleiders horen in de externe portal, niet in de interne app —
    // de echte grens ligt in de database (RLS/functies), dit is enkel
    // een consistente doorverwijzing.
    const isBegeleider = await checkBegeleiderProfiel(data.session.user.id);
    if (isBegeleider) {
      throw redirect({ to: "/begeleider" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, signOut } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand">
          <img src={amiLegalLogoIcon} alt="" className="brand-mark" />
          Ami Legal
        </Link>
        <nav className="sidebar-nav">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }}>
            {t("nav.dashboard")}
          </Link>
          <Link to="/klanten" activeProps={{ className: "active" }}>
            {t("nav.klanten")}
          </Link>
          <Link to="/aanvragen" activeProps={{ className: "active" }}>
            {t("nav.aanvragen")}
          </Link>
        </nav>
        <div className="sidebar-footer">
          <LanguageSwitcher direction="up" />
          {user?.email && <span className="sidebar-user">{user.email}</span>}
          <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
            {t("nav.afmelden")}
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
