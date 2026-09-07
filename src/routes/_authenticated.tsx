import { createRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth" });
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
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-mark">A</div>
          Ami Legal
        </div>
        <nav className="topbar-nav">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }}>
            Dashboard
          </Link>
          <Link to="/aanvragen" activeProps={{ className: "active" }}>
            Aanvragen
          </Link>
        </nav>
        <div className="topbar-actions">
          {user?.email && <span className="text-secondary">{user.email}</span>}
          <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
            Afmelden
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
