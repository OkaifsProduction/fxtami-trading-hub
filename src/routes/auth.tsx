import { useState } from "react";
import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { authFormSchema } from "@/lib/schema";
import { usePageTitle } from "@/lib/usePageTitle";
import amiLegalLogo from "@/assets/ami-legal-logo.svg";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  usePageTitle("Aanmelden");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const result = authFormSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "email") errors.email = issue.message;
        if (issue.path[0] === "password") errors.password = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    const { error } = await signIn(result.data.email, result.data.password);
    setSubmitting(false);
    if (error) {
      setFormError("Aanmelden mislukt. Controleer e-mail en wachtwoord.");
      return;
    }
    navigate({ to: "/" });
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="auth-header">
          <img src={amiLegalLogo} alt="" className="brand-mark" />
          <h1 className="auth-title">Ami Legal</h1>
          <p className="auth-subtitle">Meld je aan om aanvragen te beheren</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {formError && <div className="form-error">{formError}</div>}

          <div className="field">
            <label className="field-label" htmlFor="email">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="naam@kantoor.be"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Bezig met aanmelden…" : "Aanmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
