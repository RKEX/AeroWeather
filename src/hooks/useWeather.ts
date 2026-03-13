import { getWeatherData } from "@/lib/weather-api";
import { WeatherData } from "@/types/weather";
import { useEffect, useState } from "react";

export function useWeather(lat: number | null, lon: number | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getWeatherData(lat, lon);

        if (!cancelled) {
          if (data) {
            setWeather(data);
          } else {
            setError("Weather API returned empty data");
          }
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
        if (!cancelled) {
          setError("Failed to load weather data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return { weather, loading, error };
}
