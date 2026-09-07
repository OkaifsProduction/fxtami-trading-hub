import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { DossierRow, KlantRow, RequestRow, RequestStatus } from "./database.types";
import type { DossierFormValues, KlantFormValues, RequestFormValues } from "./schema";

// ============ Klanten ============

export const klantKeys = {
  all: ["klanten"] as const,
  list: () => [...klantKeys.all, "list"] as const,
  detail: (id: string) => [...klantKeys.all, "detail", id] as const,
};

export function useKlanten() {
  return useQuery({
    queryKey: klantKeys.list(),
    queryFn: async (): Promise<KlantRow[]> => {
      const { data, error } = await supabase.from("klanten").select("*").order("naam");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface KlantWithDossierCount extends KlantRow {
  dossierCount: number;
}

export function useKlantenWithDossierCount() {
  return useQuery({
    queryKey: [...klantKeys.list(), "withCount"],
    queryFn: async (): Promise<KlantWithDossierCount[]> => {
      const [klantenRes, dossiersRes] = await Promise.all([
        supabase.from("klanten").select("*").order("naam"),
        supabase.from("dossiers").select("klant_id"),
      ]);
      if (klantenRes.error) throw klantenRes.error;
      if (dossiersRes.error) throw dossiersRes.error;

      const counts = new Map<string, number>();
      for (const d of dossiersRes.data ?? []) {
        counts.set(d.klant_id, (counts.get(d.klant_id) ?? 0) + 1);
      }
      return (klantenRes.data ?? []).map((k) => ({ ...k, dossierCount: counts.get(k.id) ?? 0 }));
    },
  });
}

export function useKlant(id: string) {
  return useQuery({
    queryKey: klantKeys.detail(id),
    queryFn: async (): Promise<KlantRow> => {
      const { data, error } = await supabase.from("klanten").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

function toKlantPayload(values: KlantFormValues) {
  return {
    naam: values.naam,
    klant_type: values.klantType || null,
    identificatienummer: values.identificatienummer || null,
    email: values.email || null,
    telefoon: values.telefoon || null,
    adres: values.adres || null,
    extra_info: values.extraInfo || null,
  };
}

export function useCreateKlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: KlantFormValues) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Niet aangemeld");
      const { data, error } = await supabase
        .from("klanten")
        .insert({ ...toKlantPayload(values), user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: klantKeys.all });
    },
  });
}

export function useUpdateKlant(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: KlantFormValues) => {
      const { data, error } = await supabase
        .from("klanten")
        .update(toKlantPayload(values))
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: klantKeys.all });
      queryClient.invalidateQueries({ queryKey: klantKeys.detail(id) });
    },
  });
}

export function useSetKlantArchived(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gearchiveerd: boolean) => {
      const { data, error } = await supabase
        .from("klanten")
        .update({ gearchiveerd })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: klantKeys.all });
      queryClient.invalidateQueries({ queryKey: klantKeys.detail(id) });
    },
  });
}

// ============ Dossiers ============

export const dossierKeys = {
  all: ["dossiers"] as const,
  list: () => [...dossierKeys.all, "list"] as const,
  byKlant: (klantId: string) => [...dossierKeys.all, "byKlant", klantId] as const,
  detail: (id: string) => [...dossierKeys.all, "detail", id] as const,
};

export function useDossiers() {
  return useQuery({
    queryKey: dossierKeys.list(),
    queryFn: async (): Promise<DossierRow[]> => {
      const { data, error } = await supabase
        .from("dossiers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface DossierOption extends DossierRow {
  klantNaam: string;
}

/** Dossiers joined with their klant naam, for pickers and cross-dossier views. */
export function useDossierOptions() {
  return useQuery({
    queryKey: [...dossierKeys.list(), "withKlant"],
    queryFn: async (): Promise<DossierOption[]> => {
      const [dossiersRes, klantenRes] = await Promise.all([
        supabase.from("dossiers").select("*").order("created_at", { ascending: false }),
        supabase.from("klanten").select("id, naam"),
      ]);
      if (dossiersRes.error) throw dossiersRes.error;
      if (klantenRes.error) throw klantenRes.error;

      const naamByKlantId = new Map((klantenRes.data ?? []).map((k) => [k.id, k.naam]));
      return (dossiersRes.data ?? []).map((d) => ({
        ...d,
        klantNaam: naamByKlantId.get(d.klant_id) ?? "Onbekende klant",
      }));
    },
  });
}

export function useDossiersByKlant(klantId: string) {
  return useQuery({
    queryKey: dossierKeys.byKlant(klantId),
    queryFn: async (): Promise<DossierRow[]> => {
      const { data, error } = await supabase
        .from("dossiers")
        .select("*")
        .eq("klant_id", klantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(klantId),
  });
}

export function useDossier(id: string) {
  return useQuery({
    queryKey: dossierKeys.detail(id),
    queryFn: async (): Promise<DossierRow> => {
      const { data, error } = await supabase.from("dossiers").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

function toDossierPayload(values: DossierFormValues) {
  return {
    titel: values.titel,
    omschrijving: values.omschrijving || null,
    status: values.status,
  };
}

export function useCreateDossier(klantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: DossierFormValues) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Niet aangemeld");
      const { data, error } = await supabase
        .from("dossiers")
        .insert({ ...toDossierPayload(values), klant_id: klantId, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dossierKeys.all });
      queryClient.invalidateQueries({ queryKey: dossierKeys.byKlant(klantId) });
    },
  });
}

export function useUpdateDossier(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: DossierFormValues) => {
      const { data, error } = await supabase
        .from("dossiers")
        .update(toDossierPayload(values))
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dossierKeys.all });
      queryClient.invalidateQueries({ queryKey: dossierKeys.detail(id) });
    },
  });
}

// ============ Aanvragen (requests) ============

export const requestKeys = {
  all: ["requests"] as const,
  list: () => [...requestKeys.all, "list"] as const,
  byDossier: (dossierId: string) => [...requestKeys.all, "byDossier", dossierId] as const,
  detail: (id: string) => [...requestKeys.all, "detail", id] as const,
};

export function useRequests() {
  return useQuery({
    queryKey: requestKeys.list(),
    queryFn: async (): Promise<RequestRow[]> => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface RequestWithContext extends RequestRow {
  dossierTitel: string | null;
  klantId: string | null;
  klantNaam: string | null;
}

/** Aanvragen joined with their dossier + klant, for the cross-dossier /aanvragen view and dashboard. */
export function useRequestsWithContext() {
  return useQuery({
    queryKey: [...requestKeys.list(), "withContext"],
    queryFn: async (): Promise<RequestWithContext[]> => {
      const [requestsRes, dossiersRes, klantenRes] = await Promise.all([
        supabase.from("requests").select("*").order("created_at", { ascending: false }),
        supabase.from("dossiers").select("id, titel, klant_id"),
        supabase.from("klanten").select("id, naam"),
      ]);
      if (requestsRes.error) throw requestsRes.error;
      if (dossiersRes.error) throw dossiersRes.error;
      if (klantenRes.error) throw klantenRes.error;

      const naamByKlantId = new Map((klantenRes.data ?? []).map((k) => [k.id, k.naam]));
      const dossierById = new Map((dossiersRes.data ?? []).map((d) => [d.id, d]));

      return (requestsRes.data ?? []).map((r) => {
        const dossier = r.dossier_id ? dossierById.get(r.dossier_id) : undefined;
        const klantId = dossier?.klant_id ?? null;
        return {
          ...r,
          dossierTitel: dossier?.titel ?? null,
          klantId,
          klantNaam: klantId ? (naamByKlantId.get(klantId) ?? null) : null,
        };
      });
    },
  });
}

export function useRequestsByDossier(dossierId: string) {
  return useQuery({
    queryKey: requestKeys.byDossier(dossierId),
    queryFn: async (): Promise<RequestRow[]> => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("dossier_id", dossierId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(dossierId),
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: async (): Promise<RequestRow> => {
      const { data, error } = await supabase.from("requests").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });
}

function toRequestPayload(values: RequestFormValues) {
  return {
    dossier_id: values.dossierId,
    requested_amount: values.requestedAmount,
    granted_amount: values.grantedAmount,
    status: values.status,
    extra_info: values.extraInfo || null,
  };
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: RequestFormValues) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Niet aangemeld");
      const { data, error } = await supabase
        .from("requests")
        .insert({ ...toRequestPayload(values), user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.list() });
      if (data.dossier_id) {
        queryClient.invalidateQueries({ queryKey: requestKeys.byDossier(data.dossier_id) });
      }
    },
  });
}

export function useUpdateRequest(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: RequestFormValues) => {
      const { data, error } = await supabase
        .from("requests")
        .update(toRequestPayload(values))
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: requestKeys.list() });
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(id) });
      if (data.dossier_id) {
        queryClient.invalidateQueries({ queryKey: requestKeys.byDossier(data.dossier_id) });
      }
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });
    },
  });
}

export interface DashboardStats {
  openCount: number;
  handledCount: number;
  totalRequested: number;
  totalGranted: number;
}

export function computeStats(requests: RequestRow[]): DashboardStats {
  return requests.reduce<DashboardStats>(
    (acc, r) => {
      const status: RequestStatus = r.status;
      if (status === "open") acc.openCount += 1;
      else acc.handledCount += 1;
      acc.totalRequested += r.requested_amount;
      acc.totalGranted += r.granted_amount ?? 0;
      return acc;
    },
    { openCount: 0, handledCount: 0, totalRequested: 0, totalGranted: 0 },
  );
}
