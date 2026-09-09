import { useLocale } from "@/lib/i18n";

export function AppFooter() {
  const { t } = useLocale();
  return (
    <div className="app-footer">
      © {new Date().getFullYear()} Ami Legal. {t("common.alleRechtenVoorbehouden")}
    </div>
  );
}
