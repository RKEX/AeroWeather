import { WeatherData } from "@/types/weather";

export type SkyTimeData = {
  currentTime: string;
  sunrise: string;
  sunset: string;
  timezone?: string;
  utcOffsetSeconds?: number;
};

export function extractSkyTimeData(weather: WeatherData): SkyTimeData | null {
  const currentTime = weather.currentTime;
  if (!currentTime) return null;

  const currentDate = currentTime.slice(0, 10);
  const dayIndex = weather.daily.time.findIndex((day) => day === currentDate);
  const resolvedIndex = dayIndex >= 0 ? dayIndex : 0;

  const sunrise = weather.daily.sunrise[resolvedIndex];
  const sunset = weather.daily.sunset[resolvedIndex];

  if (!sunrise || !sunset) return null;

  return {
    currentTime,
    sunrise,
    sunset,
    timezone: weather.timezone,
    utcOffsetSeconds: weather.utcOffsetSeconds,
  };
}
