"use client";

import { WeatherData } from "@/types/weather";
import { useEffect, useState } from "react";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export function useWeather(lat: number | null, lon: number | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lon === null) {
      setLoading(false);
      return;
    }

    // Create a fresh worker per fetch to avoid cross-request contamination
    const worker = new Worker(new URL("../workers/weather-worker.ts", import.meta.url));

    setLoading(true);
    setError(null);

    const weatherUrl = new URL(WEATHER_API_URL);
    weatherUrl.searchParams.append("latitude", lat.toString());
    weatherUrl.searchParams.append("longitude", lon.toString());
    weatherUrl.searchParams.append("timezone", "auto");
    weatherUrl.searchParams.append("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m");
    weatherUrl.searchParams.append("hourly", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,uv_index");
    weatherUrl.searchParams.append("daily", "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max");
    weatherUrl.searchParams.append("forecast_days", "10");

    const aqiUrl = new URL(AQI_API_URL);
    aqiUrl.searchParams.append("latitude", lat.toString());
    aqiUrl.searchParams.append("longitude", lon.toString());
    aqiUrl.searchParams.append("timezone", "auto");
    aqiUrl.searchParams.append("current", "us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone");

    worker.postMessage({
      lat,
      lon,
      weatherUrl: weatherUrl.toString(),
      aqiUrl: aqiUrl.toString(),
    });

    const handleMessage = (e: MessageEvent) => {
      const { type, data, error } = e.data;
      if (type === "SUCCESS") {
        setWeather(data);
        setLoading(false);
      } else if (type === "ERROR") {
        setError(error);
        setLoading(false);
      }
    };

    worker.addEventListener("message", handleMessage);

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
    };
  }, [lat, lon]);

  return { weather, loading, error };
}
