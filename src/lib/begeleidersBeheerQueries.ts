import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type {
  BegeleiderProfielRow,
  BegeleiderStatus,
  BegeleiderUitnodigingRow,
} from "./database.types";
import type { BegeleiderUitnodigingValues } from "./schema";

/**
 * Intern begeleidersbeheer. Bewust gescheiden van begeleiderQueries.ts: dat
 * bestand is het externe portaal (de begeleider zelf, uitsluitend via de drie
 * security definer-functies). Dit bestand is de interne kant en praat met de
 * tabellen, achter de is_intern()-policies uit migratie 0011.
 */

export const begeleidersBeheerKeys = {
  all: ["begeleidersBeheer"] as const,
  overzicht: () => [...begeleidersBeheerKeys.all, "overzicht"] as const,
  profiel: (id: string) => [...begeleidersBeheerKeys.all, "profiel", id] as const,
  toewijzingen: (id: string) => [...begeleidersBeheerKeys.all, "toewijzingen", id] as const,
  uitnodiging: (id: string) => [...begeleidersBeheerKeys.all, "uitnodiging", id] as const,
};

/** Eén rij in het overzicht — een bestaand profiel óf een openstaande uitnodiging. */
export interface BegeleiderOverzichtRij {
  key: string;
  soort: "profiel" | "uitnodiging";
  id: string;
  naam: string;
  organisatie: string | null;
  email: string | null;
  status: BegeleiderStatus;
  aantalDossiers: number;
  createdAt: string;
}

export function afgeleideStatus(profiel: BegeleiderProfielRow): BegeleiderStatus {
  if (!profiel.actief) return "inactief";
  if (profiel.geactiveerd_at === null) return "uitgenodigd";
  return "actief";
}

/** Sorteersleutel: organisatie als die er is, anders de contactpersoon. */
function sorteerNaam(rij: { organisatie: string | null; naam: string }) {
  return (rij.organisatie ?? rij.naam).toLowerCase();
}

/**
 * Begeleiders + openstaande uitnodigingen in één alfabetische lijst.
 * Drie parallelle queries met een client-side join, hetzelfde patroon als
 * de rest van de app.
 */
export function useBegeleidersOverzicht() {
  return useQuery({
    queryKey: begeleidersBeheerKeys.overzicht(),
    queryFn: async (): Promise<BegeleiderOverzichtRij[]> => {
      const [profielenRes, uitnodigingenRes, toewijzingenRes] = await Promise.all([
        supabase.from("begeleider_profiles").select("*"),
        supabase.from("begeleider_uitnodigingen").select("*").eq("status", "open"),
        supabase.from("dossier_begeleiders").select("begeleider_id, actief").eq("actief", true),
      ]);
      if (profielenRes.error) throw profielenRes.error;
      if (uitnodigingenRes.error) throw uitnodigingenRes.error;
      if (toewijzingenRes.error) throw toewijzingenRes.error;

      const aantalPerBegeleider = new Map<string, number>();
      for (const t of toewijzingenRes.data ?? []) {
        aantalPerBegeleider.set(t.begeleider_id, (aantalPerBegeleider.get(t.begeleider_id) ?? 0) + 1);
      }

      const uitProfielen: BegeleiderOverzichtRij[] = (profielenRes.data ?? []).map((p) => ({
        key: `profiel-${p.id}`,
        soort: "profiel",
        id: p.id,
        naam: p.naam,
        organisatie: p.organisatie,
        email: p.email,
        status: afgeleideStatus(p),
        aantalDossiers: aantalPerBegeleider.get(p.id) ?? 0,
        createdAt: p.created_at,
      }));

      // Een uitnodiging die intussen geaccepteerd is, staat al als profiel in
      // de lijst — we halen hierboven enkel status 'open' op, dus dubbels zijn
      // uitgesloten.
      const uitUitnodigingen: BegeleiderOverzichtRij[] = (uitnodigingenRes.data ?? []).map((u) => ({
        key: `uitnodiging-${u.id}`,
        soort: "uitnodiging",
        id: u.id,
        naam: u.naam,
        organisatie: u.organisatie,
        email: u.email,
        status: "uitgenodigd",
        aantalDossiers: 0,
        createdAt: u.created_at,
      }));

      return [...uitProfielen, ...uitUitnodigingen].sort((a, b) =>
        sorteerNaam(a).localeCompare(sorteerNaam(b)),
      );
    },
  });
}

export function useBegeleiderProfiel(id: string) {
  return useQuery({
    queryKey: begeleidersBeheerKeys.profiel(id),
    queryFn: async (): Promise<BegeleiderProfielRow | null> => {
      const { data, error } = await supabase
        .from("begeleider_profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export function useUitnodiging(id: string) {
  return useQuery({
    queryKey: begeleidersBeheerKeys.uitnodiging(id),
    queryFn: async (): Promise<BegeleiderUitnodigingRow | null> => {
      const { data, error } = await supabase
        .from("begeleider_uitnodigingen")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

export interface ToewijzingRij {
  id: string;
  dossierId: string;
  dossierTitel: string;
  klantNaam: string;
  actief: boolean;
  createdAt: string;
  revokedAt: string | null;
}

/** Alle toewijzingen van één begeleider, met dossier- en klantnaam erbij. */
export function useBegeleiderToewijzingen(begeleiderId: string) {
  return useQuery({
    queryKey: begeleidersBeheerKeys.toewijzingen(begeleiderId),
    queryFn: async (): Promise<ToewijzingRij[]> => {
      const { data: toewijzingen, error } = await supabase
        .from("dossier_begeleiders")
        .select("*")
        .eq("begeleider_id", begeleiderId);
      if (error) throw error;
      if (!toewijzingen || toewijzingen.length === 0) return [];

      const [dossiersRes, klantenRes] = await Promise.all([
        supabase.from("dossiers").select("id, titel, klant_id"),
        supabase.from("klanten").select("id, naam"),
      ]);
      if (dossiersRes.error) throw dossiersRes.error;
      if (klantenRes.error) throw klantenRes.error;

      const dossierById = new Map((dossiersRes.data ?? []).map((d) => [d.id, d]));
      const klantNaamById = new Map((klantenRes.data ?? []).map((k) => [k.id, k.naam]));

      return toewijzingen
        .map((t) => {
          const dossier = dossierById.get(t.dossier_id);
          return {
            id: t.id,
            dossierId: t.dossier_id,
            dossierTitel: dossier?.titel ?? "",
            klantNaam: dossier ? (klantNaamById.get(dossier.klant_id) ?? "") : "",
            actief: t.actief,
            createdAt: t.created_at,
            revokedAt: t.revoked_at,
          };
        })
        .sort((a, b) => a.klantNaam.localeCompare(b.klantNaam));
    },
    enabled: Boolean(begeleiderId),
  });
}

/** De dossiers die bij een openstaande uitnodiging klaargezet zijn. */
export function useUitnodigingDossiers(uitnodigingId: string) {
  return useQuery({
    queryKey: [...begeleidersBeheerKeys.uitnodiging(uitnodigingId), "dossiers"],
    queryFn: async (): Promise<{ dossierId: string }[]> => {
      const { data, error } = await supabase
        .from("uitnodiging_dossiers")
        .select("dossier_id")
        .eq("uitnodiging_id", uitnodigingId);
      if (error) throw error;
      return (data ?? []).map((r) => ({ dossierId: r.dossier_id }));
    },
    enabled: Boolean(uitnodigingId),
  });
}

/**
 * Uitnodigen: eerst de uitnodiging, dan de aangevinkte dossiers. De dossiers
 * worden pas echte toewijzingen op het moment dat de begeleider zelf activeert
 * — tot dan bestaat er nog geen enkele toegang.
 */
export function useCreateUitnodiging() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: BegeleiderUitnodigingValues) => {
      const { data: uitnodiging, error } = await supabase
        .from("begeleider_uitnodigingen")
        .insert({
          email: values.email,
          naam: values.naam,
          organisatie: values.organisatie === "" ? null : (values.organisatie ?? null),
        })
        .select()
        .single();
      if (error) throw error;

      if (values.dossierIds.length > 0) {
        const { error: koppelError } = await supabase.from("uitnodiging_dossiers").insert(
          values.dossierIds.map((dossierId) => ({
            uitnodiging_id: uitnodiging.id,
            dossier_id: dossierId,
          })),
        );
        if (koppelError) throw koppelError;
      }

      return uitnodiging;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: begeleidersBeheerKeys.all });
    },
  });
}

export function useIntrekkenUitnodiging() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uitnodigingId: string) => {
      const { error } = await supabase
        .from("begeleider_uitnodigingen")
        .update({ status: "ingetrokken" })
        .eq("id", uitnodigingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: begeleidersBeheerKeys.all });
    },
  });
}

/**
 * De account-brede noodstop. Alle drie de portaalfuncties controleren
 * bp.actief, dus dit werkt onmiddellijk door op elke volgende aanvraag van de
 * begeleider — over al zijn dossiers heen.
 */
export function useSetBegeleiderActief(begeleiderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (actief: boolean) => {
      const { error } = await supabase
        .from("begeleider_profiles")
        .update({ actief })
        .eq("id", begeleiderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: begeleidersBeheerKeys.all });
    },
  });
}

/**
 * Dossier toewijzen. Eerst een update-poging, dan pas een insert — bewust
 * geen upsert: die zou bij een conflict ook dossier_id en begeleider_id
 * willen bijwerken, en de update-grant is met opzet beperkt tot actief en
 * revoked_at. Deze volgorde heractiveert meteen een eerder ingetrokken
 * toewijzing; de unique-constraint op (dossier_id, begeleider_id) sluit
 * dubbels sowieso uit.
 */
export function useToewijzenDossier(begeleiderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dossierId: string) => {
      const { data: geheractiveerd, error: updateError } = await supabase
        .from("dossier_begeleiders")
        .update({ actief: true, revoked_at: null })
        .eq("dossier_id", dossierId)
        .eq("begeleider_id", begeleiderId)
        .select("id");
      if (updateError) throw updateError;
      if ((geheractiveerd ?? []).length > 0) return;

      const { error } = await supabase
        .from("dossier_begeleiders")
        .insert({ dossier_id: dossierId, begeleider_id: begeleiderId, actief: true });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: begeleidersBeheerKeys.all });
    },
  });
}

/** Intrekken = actief op false, niet verwijderen: het auditspoor blijft staan. */
export function useIntrekkenToewijzing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (toewijzingId: string) => {
      const { error } = await supabase
        .from("dossier_begeleiders")
        .update({ actief: false, revoked_at: new Date().toISOString() })
        .eq("id", toewijzingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: begeleidersBeheerKeys.all });
    },
  });
}
