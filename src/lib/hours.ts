import { restaurant } from "../data/restaurant";

const DAY_NAMES = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Weekday, minutes-since-midnight and ISO date in the restaurant's own time zone. */
function localNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: restaurant.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return {
    weekday,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    isoDate: `${get("year")}-${get("month")}-${get("day")}`,
  };
}

/** Today's date (YYYY-MM-DD) in Belgium — used as the reservation form's minimum. */
export function todayIso(now = new Date()) {
  return localNow(now).isoDate;
}

export interface OpenStatus {
  isOpen: boolean;
  label: string;
}

export function getOpenStatus(now = new Date()): OpenStatus {
  const { weekday, minutes } = localNow(now);
  const today = restaurant.schedule[weekday];

  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { isOpen: true, label: `Nu open · tot ${today.close}` };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { isOpen: false, label: `Vandaag open vanaf ${today.open}` };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const day = (weekday + offset) % 7;
    const slot = restaurant.schedule[day];
    if (slot) {
      const when = offset === 1 ? "Morgen" : DAY_NAMES[day].charAt(0).toUpperCase() + DAY_NAMES[day].slice(1);
      return { isOpen: false, label: `Gesloten · ${when} open vanaf ${slot.open}` };
    }
  }
  return { isOpen: false, label: "Gesloten" };
}

/** Index into restaurant.schedule for today, for highlighting the hours table. */
export function todayWeekday(now = new Date()) {
  return localNow(now).weekday;
}

const weekdayOf = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  // Noon UTC keeps the calendar day stable regardless of the visitor's own time zone.
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
};

/** Bookable times (every `stepMinutes`) within opening hours on `date`, skipping times already past today. */
export function timeSlotsFor(date: string, stepMinutes = 15): string[] {
  const weekday = weekdayOf(date);
  if (weekday === null) return [];
  const slot = restaurant.schedule[weekday];
  if (!slot) return [];
  const earliest = date === todayIso() ? localNow().minutes + 1 : 0;
  const slots: string[] = [];
  for (let t = toMinutes(slot.open); t < toMinutes(slot.close); t += stepMinutes) {
    if (t >= earliest) slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return slots;
}

/** Guest-facing reason a date can't be booked, or null when it has bookable slots. */
export function closedReason(date: string): string | null {
  const weekday = weekdayOf(date);
  if (weekday === null) return null;
  if (!restaurant.schedule[weekday]) return `Op ${DAY_NAMES[weekday]} zijn we gesloten — kies een andere dag.`;
  if (timeSlotsFor(date).length === 0) return "Voor vandaag kan er niet meer gereserveerd worden — kies een andere dag.";
  return null;
}

/**
 * Returns a guest-facing error if the requested slot falls outside opening
 * hours, or null if it's fine. `date` is YYYY-MM-DD, `time` is HH:MM.
 */
export function validateReservationSlot(date: string, time: string): string | null {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d || !/^\d{2}:\d{2}$/.test(time)) return "Kies een geldige datum en tijd.";
  // Noon UTC keeps the calendar day stable regardless of the visitor's own time zone.
  const weekday = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
  const slot = restaurant.schedule[weekday];
  if (!slot) {
    return `Op ${DAY_NAMES[weekday]} zijn we gesloten. Kies een andere dag.`;
  }
  const t = toMinutes(time);
  if (t < toMinutes(slot.open) || t >= toMinutes(slot.close)) {
    return `Op ${DAY_NAMES[weekday]} zijn we open van ${slot.open} tot ${slot.close}. Kies een tijd binnen de openingsuren.`;
  }
  if (date === todayIso() && t <= localNow().minutes) {
    return "Dat tijdstip is al voorbij. Kies een later uur.";
  }
  return null;
}
