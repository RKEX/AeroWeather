import type { WeatherData } from "@/types/weather";

// Open-Meteo default for wind_speed_10m is km/h.
// If the API request is changed to m/s in the future, switch this once.
const API_WIND_UNIT: "kmh" | "ms" = "kmh";

export function windFromApi(raw: number): number {
  const safe = Number.isFinite(raw) ? raw : 0;
  return API_WIND_UNIT === "ms" ? safe * 3.6 : safe;
}

export function windSeriesFromApi(raw: number[]): number[] {
  return raw.map(windFromApi);
}

export function roundWindKmh(windKmh: number): number {
  const safe = Number.isFinite(windKmh) ? windKmh : 0;
  return Math.round(safe);
}

export function formatWindKmh(windKmh: number): string {
  return `${roundWindKmh(windKmh)} km/h`;
}

export function getCurrentWindKmh(weather: WeatherData): number {
  return weather.current.windSpeed10m;
}

export function getForecastPeakWindKmh(weather: WeatherData, dayIndex: number): number {
  if (dayIndex < 0) return getCurrentWindKmh(weather);

  const start = dayIndex * 24;
  const hourlySlice = weather.hourly.windSpeed10m.slice(start, start + 24);
  if (hourlySlice.length === 0) return getCurrentWindKmh(weather);

  return Math.max(...hourlySlice);
}
