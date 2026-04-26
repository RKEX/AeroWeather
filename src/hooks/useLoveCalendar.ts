"use client";

import { LoveDay } from "@/lib/love-intelligence";
import { useEffect, useState } from "react";

interface LoveCalendarResponse {
  days: LoveDay[];
}

export function useLoveCalendar(lat: number, lon: number) {
  const [data, setData] = useState<LoveCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
    });

    fetch(`/api/love-intelligence?lat=${lat}&lon=${lon}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json()) as
          | LoveCalendarResponse
          | {
              error?: string;
            };

        if (!response.ok) {
          throw new Error(payload && "error" in payload ? payload.error || "Failed to fetch love intelligence" : "Failed to fetch love intelligence");
        }

        setData(payload as LoveCalendarResponse);
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if ((fetchError as { name?: string })?.name === "AbortError") return;

        const message = fetchError instanceof Error ? fetchError.message : "Love data unavailable";
        setError(message);
        setData(null);
        setLoading(false);
      });

    return () => controller.abort();
  }, [lat, lon]);

  return { data, loading, error };
}
