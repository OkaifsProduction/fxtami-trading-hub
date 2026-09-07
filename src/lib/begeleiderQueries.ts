import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { BegeleiderAanvraag, BegeleiderDossierOverzicht } from "./database.types";

/**
 * Plain async check (geen hook) — gebruikt in route beforeLoad-guards en
 * direct na inloggen, waar React Query hooks niet beschikbaar zijn.
 * Leunt op de "begeleider_profiles_select_own"-policy: een gebruiker kan
 * enkel zijn eigen rij lezen, dus dit test tegelijk "bestaat de rij" en
 * "hoort ze bij deze gebruiker".
 */
export async function checkBegeleiderProfiel(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("begeleider_profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export const begeleiderKeys = {
  all: ["begeleider"] as const,
  mijnDossiers: () => [...begeleiderKeys.all, "mijnDossiers"] as const,
  dossierDetail: (id: string) => [...begeleiderKeys.all, "dossierDetail", id] as const,
  dossierAanvragen: (id: string) => [...begeleiderKeys.all, "dossierAanvragen", id] as const,
};

/** "Mijn dossiers" — enkel de dossiers waarvoor een actieve toewijzing bestaat. */
export function useBegeleiderMijnDossiers() {
  return useQuery({
    queryKey: begeleiderKeys.mijnDossiers(),
    queryFn: async (): Promise<BegeleiderDossierOverzicht[]> => {
      const { data, error } = await supabase.rpc("begeleider_mijn_dossiers");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBegeleiderDossierDetail(dossierId: string) {
  return useQuery({
    queryKey: begeleiderKeys.dossierDetail(dossierId),
    queryFn: async (): Promise<BegeleiderDossierOverzicht | null> => {
      const { data, error } = await supabase.rpc("begeleider_dossier_detail", {
        p_dossier_id: dossierId,
      });
      if (error) throw error;
      return data?.[0] ?? null;
    },
    enabled: Boolean(dossierId),
  });
}

export function useBegeleiderDossierAanvragen(dossierId: string) {
  return useQuery({
    queryKey: begeleiderKeys.dossierAanvragen(dossierId),
    queryFn: async (): Promise<BegeleiderAanvraag[]> => {
      const { data, error } = await supabase.rpc("begeleider_dossier_aanvragen", {
        p_dossier_id: dossierId,
      });
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(dossierId),
  });
}
