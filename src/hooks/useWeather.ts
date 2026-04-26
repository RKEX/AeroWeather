"use client";

import { WeatherData } from "@/types/weather";
import { useEffect, useState } from "react";

export function useWeather(lat: number | null, lon: number | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (lat === null || lon === null) {
      Promise.resolve().then(() => setLoading(false));
      return () => controller.abort();
    }

    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
    });

    fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json()) as WeatherData | { error?: string };
        if (!response.ok) {
          throw new Error("error" in payload ? payload.error || "Failed to fetch weather" : "Failed to fetch weather");
        }
        setWeather(payload as WeatherData);
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if ((fetchError as { name?: string })?.name === "AbortError") return;
        setError(null);
        setWeather(null);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [lat, lon]);

  return { weather, loading, error };
}
