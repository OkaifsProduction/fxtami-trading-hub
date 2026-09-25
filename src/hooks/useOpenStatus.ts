import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "../lib/hours";

/** Live "open now" status in the restaurant's time zone, refreshed every minute. */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState(getOpenStatus);

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return status;
}
