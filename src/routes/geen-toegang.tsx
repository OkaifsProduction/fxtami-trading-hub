import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLocale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AppFooter } from "@/components/AppFooter";
import amiLegalLogoFull from "@/assets/ami-legal-logo-full.png";

/**
 * Eindpunt voor een aangemeld account dat noch intern personeel, noch
 * begeleider is. Bewust een eigen route buiten beide beveiligde layouts:
 * zou dit scherm binnen een van die layouts vallen, dan zou de guard opnieuw
 * doorverwijzen en ontstaat er een oneindige redirectlus.
 */
export const geenToegangRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/geen-toegang",
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth" });
    }
  },
  component: GeenToegangPage,
});

function GeenToegangPage() {
  const { t } = useLocale();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  usePageTitle(t("geenToegang.titel"));

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="auth-shell">
      <div style={{ width: 220, marginBottom: 16 }}>
        <LanguageSwitcher />
      </div>
      <div className="card auth-card">
        <div className="auth-header">
          <img src={amiLegalLogoFull} alt="Ami Legal" className="brand-mark auth-brand-mark" />
          <h1 className="auth-title">{t("geenToegang.titel")}</h1>
          <p className="auth-subtitle">{t("geenToegang.beschrijving")}</p>
        </div>
        {user?.email && (
          <p className="text-secondary" style={{ fontSize: 13, textAlign: "center", marginBottom: 16 }}>
            {user.email}
          </p>
        )}
        <button className="btn btn-secondary btn-block" onClick={handleSignOut}>
          {t("nav.afmelden")}
        </button>
      </div>
      <AppFooter />
    </div>
  );
}
