import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cloudy,
  Moon,
  Sun,
} from "lucide-react";

export type WeatherTheme =
  | "clear"
  | "cloudy"
  | "rain"
  | "storm"
  | "snow"
  | "fog"
  | "night";

export function getWeatherTheme(
  weatherCode: number,
  isDay: boolean | number,
): WeatherTheme {
  // 0: Clear sky
  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  // 45, 48: Fog and depositing rime fog
  // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
  // 56, 57: Freezing Drizzle: Light and dense intensity
  // 61, 63, 65: Rain: Slight, moderate and heavy intensity
  // 66, 67: Freezing Rain: Light and heavy intensity
  // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
  // 77: Snow grains
  // 80, 81, 82: Rain showers: Slight, moderate, and violent
  // 85, 86: Snow showers slight and heavy
  // 95: Thunderstorm: Slight or moderate
  // 96, 99: Thunderstorm with slight and heavy hail

  const day = typeof isDay === "boolean" ? isDay : isDay === 1;

  if (!day && weatherCode <= 3 && weatherCode !== 3) return "night";

  if (weatherCode === 0) return "clear";
  if (weatherCode >= 1 && weatherCode <= 3) return "cloudy";
  if (weatherCode === 45 || weatherCode === 48) return "fog";
  if (weatherCode >= 51 && weatherCode <= 67) return "rain";
  if (weatherCode >= 71 && weatherCode <= 77) return "snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "rain";
  if (weatherCode >= 85 && weatherCode <= 86) return "snow";
  if (weatherCode >= 95 && weatherCode <= 99) return "storm";

  return "clear"; // default fallback
}

export function getWeatherIcon(
  weatherCode: number,
  isDay: boolean | number = true,
) {
  const day = typeof isDay === "boolean" ? isDay : isDay === 1;

  if (weatherCode === 0) return day ? Sun : Moon;
  if (weatherCode === 1 || weatherCode === 2) return day ? Cloud : Cloud; // Partly cloudy
  if (weatherCode === 3) return Cloudy; // Overcast
  if (weatherCode === 45 || weatherCode === 48) return CloudFog;
  if (weatherCode >= 51 && weatherCode <= 57) return CloudDrizzle;
  if (weatherCode >= 61 && weatherCode <= 67) return CloudRain;
  if (weatherCode >= 71 && weatherCode <= 77) return CloudSnow;
  if (weatherCode >= 80 && weatherCode <= 82) return CloudRain;
  if (weatherCode >= 85 && weatherCode <= 86) return CloudSnow;
  if (weatherCode >= 95 && weatherCode <= 99) return CloudLightning;

  return Sun; // fallback
}

export function getWeatherConditionText(weatherCode: number): string {
  if (weatherCode === 0) return "Clear sky";
  if (weatherCode === 1) return "Mainly clear";
  if (weatherCode === 2) return "Partly cloudy";
  if (weatherCode === 3) return "Overcast";
  if (weatherCode === 45 || weatherCode === 48) return "Fog";
  if (weatherCode >= 51 && weatherCode <= 57) return "Drizzle";
  if (weatherCode >= 61 && weatherCode <= 67) return "Rain";
  if (weatherCode >= 71 && weatherCode <= 77) return "Snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "Rain showers";
  if (weatherCode >= 85 && weatherCode <= 86) return "Snow showers";
  if (weatherCode >= 95 && weatherCode <= 99) return "Thunderstorm";

  return "Unknown";
}

export function getThemeClasses(theme: WeatherTheme): string {
  switch (theme) {
    case "clear":
      return "text-white";

    case "cloudy":
      return "text-white";

    case "rain":
      return "text-white";

    case "storm":
      return "text-white";

    case "snow":
      return "text-slate-900";

    case "fog":
      return "text-white";

    case "night":
      return "text-white";

    default:
      return "text-white";
  }
}
