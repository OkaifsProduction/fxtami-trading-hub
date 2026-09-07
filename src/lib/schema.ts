import { z } from "zod";

export const requestStatusSchema = z.enum(["open", "afgehandeld"]);

export const requestFormSchema = z
  .object({
    dossierId: z.string({ required_error: "Dossier is verplicht" }).uuid("Kies een dossier"),
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
    status: requestStatusSchema,
    extraInfo: z
      .string()
      .trim()
      .max(4000, "Extra informatie mag maximaal 4000 tekens bevatten")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => data.grantedAmount === null || data.grantedAmount <= data.requestedAmount * 10,
    {
      message: "Toegekend bedrag lijkt onwaarschijnlijk hoog t.o.v. het gevraagde bedrag",
      path: ["grantedAmount"],
    },
  );

export type RequestFormValues = z.infer<typeof requestFormSchema>;

export const authFormSchema = z.object({
  email: z.string().trim().email("Vul een geldig e-mailadres in"),
  password: z.string().min(6, "Wachtwoord moet minstens 6 tekens bevatten"),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;

export const klantTypeSchema = z.enum(["natuurlijk_persoon", "rechtspersoon"]);

export const klantFormSchema = z.object({
  naam: z
    .string()
    .trim()
    .min(1, "Naam is verplicht")
    .max(120, "Naam mag maximaal 120 tekens bevatten"),
  klantType: klantTypeSchema.optional().or(z.literal("")),
  identificatienummer: z
    .string()
    .trim()
    .max(50, "Identificatienummer mag maximaal 50 tekens bevatten")
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
  status: requestStatusSchema,
});

export type DossierFormValues = z.infer<typeof dossierFormSchema>;
