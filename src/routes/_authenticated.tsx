import { createRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { checkBegeleiderProfiel } from "@/lib/begeleiderQueries";
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
            Dashboard
          </Link>
          <Link to="/klanten" activeProps={{ className: "active" }}>
            Klanten
          </Link>
          <Link to="/aanvragen" activeProps={{ className: "active" }}>
            Aanvragen
          </Link>
        </nav>
        <div className="sidebar-footer">
          {user?.email && <span className="sidebar-user">{user.email}</span>}
          <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
            Afmelden
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
