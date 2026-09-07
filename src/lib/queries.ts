import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { RequestRow, RequestStatus } from "./database.types";
import type { RequestFormValues } from "./schema";

export const requestKeys = {
  all: ["requests"] as const,
  list: () => [...requestKeys.all, "list"] as const,
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

function toInsertPayload(values: RequestFormValues) {
  return {
    name: values.name,
    purpose: values.purpose,
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
        .insert({ ...toInsertPayload(values), user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.list() });
    },
  });
}

export function useUpdateRequest(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: RequestFormValues) => {
      const { data, error } = await supabase
        .from("requests")
        .update(toInsertPayload(values))
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.list() });
      queryClient.invalidateQueries({ queryKey: requestKeys.detail(id) });
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
      queryClient.invalidateQueries({ queryKey: requestKeys.list() });
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
