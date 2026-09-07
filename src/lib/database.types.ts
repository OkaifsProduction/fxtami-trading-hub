export type AanvraagStatus = "open" | "in_behandeling" | "goedgekeurd" | "geweigerd" | "afgehandeld";
export type DossierStatus = "open" | "gesloten";

export type KlantType = "natuurlijk_persoon" | "rechtspersoon";

export type KlantRow = {
  id: string;
  user_id: string;
  naam: string;
  email: string | null;
  telefoon: string | null;
  adres: string | null;
  extra_info: string | null;
  klant_type: KlantType | null;
  identificatienummer: string | null;
  gearchiveerd: boolean;
  created_at: string;
};

export type DossierRow = {
  id: string;
  user_id: string;
  klant_id: string;
  titel: string;
  omschrijving: string | null;
  status: DossierStatus;
  created_at: string;
};

export type RequestRow = {
  id: string;
  user_id: string;
  dossier_id: string | null;
  name: string | null;
  purpose: string | null;
  requested_amount: number;
  granted_amount: number | null;
  status: AanvraagStatus;
  extra_info: string | null;
  created_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      klanten: {
        Row: KlantRow;
        Insert: Omit<KlantRow, "id" | "user_id" | "created_at" | "gearchiveerd"> & {
          id?: string;
          user_id?: string;
          created_at?: string;
          gearchiveerd?: boolean;
        };
        Update: Partial<Omit<KlantRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      dossiers: {
        Row: DossierRow;
        Insert: Omit<DossierRow, "id" | "user_id" | "created_at"> & {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DossierRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      requests: {
        Row: RequestRow;
        Insert: Omit<RequestRow, "id" | "user_id" | "created_at" | "name" | "purpose"> & {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<RequestRow, "id" | "user_id" | "created_at" | "name" | "purpose">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
