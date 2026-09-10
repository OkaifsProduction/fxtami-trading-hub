import { z } from "zod";

export const aanvraagStatusSchema = z.enum([
  "open",
  "in_behandeling",
  "goedgekeurd",
  "geweigerd",
  "afgehandeld",
]);

export const dossierStatusSchema = z.enum(["open", "gesloten"]);

const requestFieldsShape = {
  requestedAmount: z
    .number({
      invalid_type_error: "Gevraagd bedrag is verplicht",
      required_error: "Gevraagd bedrag is verplicht",
    })
    .positive("Gevraagd bedrag moet groter dan 0 zijn")
    .max(1_000_000, "Gevraagd bedrag is te hoog"),
  grantedAmount: z
    .number({ invalid_type_error: "Toegekend bedrag moet een getal zijn" })
    .min(0, "Toegekend bedrag mag niet negatief zijn")
    .max(1_000_000, "Toegekend bedrag is te hoog")
    .nullable(),
  status: aanvraagStatusSchema,
  extraInfo: z
    .string()
    .trim()
    .max(4000, "Extra informatie mag maximaal 4000 tekens bevatten")
    .optional()
    .or(z.literal("")),
};

const grantedVsRequestedRefine = {
  check: (data: { grantedAmount: number | null; requestedAmount: number }) =>
    data.grantedAmount === null || data.grantedAmount <= data.requestedAmount * 10,
  message: "Toegekend bedrag lijkt onwaarschijnlijk hoog t.o.v. het gevraagde bedrag",
};

// Enkel de aanvraagvelden zelf, zonder dossierkoppeling — gebruikt in de
// "klant-eerst"-flow van "Nieuwe aanvraag", waar het dossier (bestaand of
// nieuw aan te maken) apart en buiten dit schema om wordt afgehandeld.
export const requestFieldsSchema = z.object(requestFieldsShape).refine(grantedVsRequestedRefine.check, {
  message: grantedVsRequestedRefine.message,
  path: ["grantedAmount"],
});

export type RequestFieldsValues = z.infer<typeof requestFieldsSchema>;

export const requestFormSchema = z
  .object({
    dossierId: z.string({ required_error: "Dossier is verplicht" }).uuid("Kies een dossier"),
    ...requestFieldsShape,
  })
  .refine(grantedVsRequestedRefine.check, {
    message: grantedVsRequestedRefine.message,
    path: ["grantedAmount"],
  });

export type RequestFormValues = z.infer<typeof requestFormSchema>;

export const authFormSchema = z.object({
  email: z.string().trim().email("Vul een geldig e-mailadres in"),
  password: z.string().min(6, "Wachtwoord moet minstens 6 tekens bevatten"),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;

export const bewindTypeSchema = z.enum(["goederen", "persoon", "beide"]);

export const klantFormSchema = z.object({
  naam: z
    .string()
    .trim()
    .min(1, "Naam is verplicht")
    .max(120, "Naam mag maximaal 120 tekens bevatten"),
  bewindType: bewindTypeSchema.optional().or(z.literal("")),
  identificatienummer: z
    .string()
    .trim()
    .max(50, "Identificatienummer mag maximaal 50 tekens bevatten")
    .optional()
    .or(z.literal("")),
  rolnummer: z
    .string()
    .trim()
    .max(50, "Rolnr mag maximaal 50 tekens bevatten")
    .optional()
    .or(z.literal("")),
  geboortedatum: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Vul een geldig e-mailadres in")
    .max(200, "E-mailadres mag maximaal 200 tekens bevatten")
    .optional()
    .or(z.literal("")),
  telefoon: z
    .string()
    .trim()
    .max(50, "Telefoonnummer mag maximaal 50 tekens bevatten")
    .optional()
    .or(z.literal("")),
  adres: z
    .string()
    .trim()
    .max(300, "Adres mag maximaal 300 tekens bevatten")
    .optional()
    .or(z.literal("")),
  vertrouwenspersoonNaam: z
    .string()
    .trim()
    .max(120, "Naam mag maximaal 120 tekens bevatten")
    .optional()
    .or(z.literal("")),
  vertrouwenspersoonTelefoon: z
    .string()
    .trim()
    .max(50, "Telefoonnummer mag maximaal 50 tekens bevatten")
    .optional()
    .or(z.literal("")),
  familieleden: z
    .string()
    .trim()
    .max(2000, "Familieleden mag maximaal 2000 tekens bevatten")
    .optional()
    .or(z.literal("")),
  extraInfo: z
    .string()
    .trim()
    .max(2000, "Extra informatie mag maximaal 2000 tekens bevatten")
    .optional()
    .or(z.literal("")),
});

export type KlantFormValues = z.infer<typeof klantFormSchema>;

export const dossierFormSchema = z.object({
  titel: z
    .string()
    .trim()
    .min(1, "Titel is verplicht")
    .max(200, "Titel mag maximaal 200 tekens bevatten"),
  omschrijving: z
    .string()
    .trim()
    .max(4000, "Omschrijving mag maximaal 4000 tekens bevatten")
    .optional()
    .or(z.literal("")),
  status: dossierStatusSchema,
});

export type DossierFormValues = z.infer<typeof dossierFormSchema>;

// Uitnodiging voor een externe begeleider. "naam" is de contactpersoon,
// "organisatie" de instantie (Familiehulp, CAW, …). Het e-mailadres wordt
// bewust in kleine letters bewaard: de database dwingt dat af, en de
// activatie matcht op het adres uit auth.users, dat Supabase eveneens in
// kleine letters bijhoudt.
export const begeleiderUitnodigingSchema = z.object({
  organisatie: z
    .string()
    .trim()
    .max(200, "Organisatie mag maximaal 200 tekens bevatten")
    .optional()
    .or(z.literal("")),
  naam: z
    .string()
    .trim()
    .min(1, "Contactpersoon is verplicht")
    .max(120, "Naam mag maximaal 120 tekens bevatten"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Vul een geldig e-mailadres in")
    .max(200, "E-mailadres mag maximaal 200 tekens bevatten"),
  dossierIds: z.array(z.string().uuid()),
});

export type BegeleiderUitnodigingValues = z.infer<typeof begeleiderUitnodigingSchema>;
