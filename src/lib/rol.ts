import { supabase } from "./supabase";
import { checkBegeleiderProfiel } from "./begeleiderQueries";

export type Rol = "intern" | "begeleider" | "geen";

/**
 * Rolbepaling voor de routing. De routing is NIET de beveiliging — die zit in
 * de RLS-policies en de security definer-functies. Dit bepaalt enkel welk deel
 * van de app iemand te zien krijgt.
 */

/**
 * Faalt bewust naar false. Zolang migratie 0011 nog niet uitgevoerd is,
 * bestaat is_intern() niet en geeft Supabase een fout terug. Dan liever een
 * duidelijk "geen toegang"-scherm dan iemand per ongeluk als intern
 * behandelen: dat laatste zou de rol precies zo zwak maken als de negatie die
 * we net vervangen hebben.
 */
export async function checkIntern(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_intern");
  if (error) return false;
  return data === true;
}

/**
 * Zet een openstaande uitnodiging om in een echt begeleideraccount. Veilig om
 * altijd aan te roepen: de functie in de database werkt uitsluitend op het
 * e-mailadres uit de geverifieerde sessie van de aanroeper, neemt geen enkele
 * parameter aan, en geeft false terug als er niets te activeren valt.
 */
export async function activeerBegeleiderAccount(): Promise<boolean> {
  const { data, error } = await supabase.rpc("begeleider_activeer_mijn_account");
  if (error) return false;
  return data === true;
}

/**
 * Volgorde is bewust: de bestaande, bewezen begeleidercheck eerst, dan intern,
 * en pas als iemand geen van beide blijkt te zijn één activatiepoging. Zo
 * betaalt de dagelijkse login nooit voor de zeldzame eerste keer, en herstelt
 * een uitgenodigde begeleider zichzelf vanaf elk startpunt in de app.
 */
export async function resolveRol(userId: string): Promise<Rol> {
  if (await checkBegeleiderProfiel(userId)) return "begeleider";
  if (await checkIntern()) return "intern";
  if (await activeerBegeleiderAccount()) return "begeleider";
  return "geen";
}
