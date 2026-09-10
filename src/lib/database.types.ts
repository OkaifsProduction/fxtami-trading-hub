export type AanvraagStatus = "open" | "in_behandeling" | "goedgekeurd" | "geweigerd" | "afgehandeld";
export type DossierStatus = "open" | "gesloten";

export type BewindType = "goederen" | "persoon" | "beide";

export type KlantRow = {
  id: string;
  user_id: string;
  naam: string;
  email: string | null;
  telefoon: string | null;
  adres: string | null;
  extra_info: string | null;
  bewind_type: BewindType | null;
  identificatienummer: string | null;
  rolnummer: string | null;
  geboortedatum: string | null;
  vertrouwenspersoon_naam: string | null;
  vertrouwenspersoon_telefoon: string | null;
  familieleden: string | null;
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

export type BegeleiderProfielRow = {
  id: string;
  naam: string;
  organisatie: string | null;
  actief: boolean;
  email: string | null;
  uitgenodigd_at: string | null;
  geactiveerd_at: string | null;
  created_at: string;
};

export type UitnodigingStatus = "open" | "geaccepteerd" | "ingetrokken";

/** Afgeleide weergavestatus in het begeleidersoverzicht. */
export type BegeleiderStatus = "actief" | "uitgenodigd" | "inactief";

export type BegeleiderUitnodigingRow = {
  id: string;
  email: string;
  naam: string;
  organisatie: string | null;
  status: UitnodigingStatus;
  aangemaakt_door: string;
  begeleider_id: string | null;
  created_at: string;
  geaccepteerd_at: string | null;
};

export type DossierBegeleiderRow = {
  id: string;
  dossier_id: string;
  begeleider_id: string;
  actief: boolean;
  toegekend_door: string | null;
  created_at: string;
  revoked_at: string | null;
};

export type UitnodigingDossierRow = {
  id: string;
  uitnodiging_id: string;
  dossier_id: string;
  created_at: string;
};

export type BegeleiderDossierOverzicht = {
  dossier_id: string;
  klant_naam: string;
  dossier_titel: string;
  dossier_status: DossierStatus;
  dossier_aangemaakt: string;
};

export type BegeleiderAanvraag = {
  aanvraag_id: string;
  requested_amount: number;
  granted_amount: number | null;
  status: AanvraagStatus;
  aangemaakt: string;
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
      // Profielen ontstaan uitsluitend via begeleider_activeer_mijn_account()
      // — de app mag ze nooit rechtstreeks aanmaken. Van de update laat de
      // database (kolom-gebonden grant) enkel deze drie velden toe.
      begeleider_profiles: {
        Row: BegeleiderProfielRow;
        Insert: never;
        Update: Partial<Pick<BegeleiderProfielRow, "naam" | "organisatie" | "actief">>;
        Relationships: [];
      };
      // toegekend_door en aangemaakt_door worden bewust weggelaten: de database
      // vult ze met auth.uid() en de policy eist diezelfde waarde, dus de app
      // kan ze niet vervalsen.
      dossier_begeleiders: {
        Row: DossierBegeleiderRow;
        Insert: Pick<DossierBegeleiderRow, "dossier_id" | "begeleider_id"> & {
          actief?: boolean;
        };
        Update: Partial<Pick<DossierBegeleiderRow, "actief" | "revoked_at">>;
        Relationships: [];
      };
      begeleider_uitnodigingen: {
        Row: BegeleiderUitnodigingRow;
        Insert: Pick<BegeleiderUitnodigingRow, "email" | "naam"> & {
          organisatie?: string | null;
        };
        Update: Partial<Pick<BegeleiderUitnodigingRow, "status">>;
        Relationships: [];
      };
      uitnodiging_dossiers: {
        Row: UitnodigingDossierRow;
        Insert: Pick<UitnodigingDossierRow, "uitnodiging_id" | "dossier_id">;
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_intern: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      begeleider_activeer_mijn_account: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      begeleider_mijn_dossiers: {
        Args: Record<string, never>;
        Returns: BegeleiderDossierOverzicht[];
      };
      begeleider_dossier_detail: {
        Args: { p_dossier_id: string };
        Returns: BegeleiderDossierOverzicht[];
      };
      begeleider_dossier_aanvragen: {
        Args: { p_dossier_id: string };
        Returns: BegeleiderAanvraag[];
      };
    };
  };
};
