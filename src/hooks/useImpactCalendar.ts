"use client";

import { ImpactDay } from "@/lib/impact-intelligence";
import { useEffect, useState } from "react";

interface ImpactCalendarResponse {
  days: ImpactDay[];
}

export function useImpactCalendar(lat: number, lon: number) {
  const [data, setData] = useState<ImpactCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
    });

    fetch(`/api/impact-intelligence?lat=${lat}&lon=${lon}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json()) as
          | ImpactCalendarResponse
          | {
              error?: string;
            };

        if (!response.ok) {
          throw new Error(payload && "error" in payload ? payload.error || "Failed to fetch impact intelligence" : "Failed to fetch impact intelligence");
        }

        setData(payload as ImpactCalendarResponse);
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if ((fetchError as { name?: string })?.name === "AbortError") return;

        const message = fetchError instanceof Error ? fetchError.message : "Impact data unavailable";
        setError(message);
        setData(null);
        setLoading(false);
      });

    return () => controller.abort();
  }, [lat, lon]);

  return { data, loading, error };
}
