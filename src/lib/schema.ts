import { z } from "zod";

export const requestStatusSchema = z.enum(["open", "afgehandeld"]);

export const requestFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Naam is verplicht")
      .max(120, "Naam mag maximaal 120 tekens bevatten"),
    purpose: z
      .string()
      .trim()
      .min(1, "Waarvoor is verplicht")
      .max(200, "Waarvoor mag maximaal 200 tekens bevatten"),
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
