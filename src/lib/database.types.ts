export type RequestStatus = "open" | "afgehandeld";

export type RequestRow = {
  id: string;
  user_id: string;
  name: string;
  purpose: string;
  requested_amount: number;
  granted_amount: number | null;
  status: RequestStatus;
  extra_info: string | null;
  created_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      requests: {
        Row: RequestRow;
        Insert: Omit<RequestRow, "id" | "user_id" | "created_at"> & {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<RequestRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
