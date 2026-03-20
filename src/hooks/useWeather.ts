"use client";

import { WeatherData } from "@/types/weather";
import { useEffect, useState, useRef } from "react";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export function useWeather(lat: number | null, lon: number | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL("../workers/weather-worker.ts", import.meta.url));

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (lat === null || lon === null) {
      setLoading(false);
      return;
    }

    const worker = workerRef.current;
    if (!worker) return;

    setLoading(true);
    setError(null);

    // Prepare URLs for the worker
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

    // Send task to worker
    worker.postMessage({
      lat,
      lon,
      weatherUrl: weatherUrl.toString(),
      aqiUrl: aqiUrl.toString()
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
    };
  }, [lat, lon]);

  return { weather, loading, error };
}
