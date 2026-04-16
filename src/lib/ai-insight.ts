import { WeatherData } from "@/types/weather";
import { getWeatherConditionText } from "./weather-theme";
import { getForecastPeakWindKmh, roundWindKmh } from "./wind";

export type InsightCategory =
  | "storm"
  | "rain"
  | "snow"
  | "wind"
  | "humidity"
  | "uv"
  | "heat"
  | "cold"
  | "clear"
  | "default";

type InsightSignal = {
  category: InsightCategory;
  priority: number;
  primary: string[];
  secondary: string[];
};

export type WeatherInsight = {
  message: string;
  category: InsightCategory;
  priority: number;
};

function average(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, val) => sum + val, 0);
  return total / values.length;
}

function pickVariant(options: string[], seed: number): string {
  if (options.length === 0) return "";
  const index = Math.abs(seed) % options.length;
  return options[index] ?? options[0] ?? "";
}

function getLocalHour(currentTime?: string): number | null {
  if (!currentTime) return null;
  const match = /T(\d{2}):(\d{2})/.exec(currentTime);
  if (!match) return null;
  return Number(match[1]);
}

function getSeed(weather: WeatherData, dayIndex: number): number {
  const base = weather.current.weatherCode * 19;
  const temp = Math.round(weather.current.temperature2m * 10);
  const wind = Math.round(weather.current.windSpeed10m * 10);
  const humidity = weather.current.relativeHumidity2m;
  return base + temp + wind + humidity + dayIndex * 37;
}

function buildSignals(weather: WeatherData, dayIndex: number): InsightSignal[] {
  const signals: InsightSignal[] = [];
  const isForecast = dayIndex >= 0;
  const { current, daily, hourly } = weather;

  const weatherCode = isForecast
    ? (daily.weatherCode[dayIndex] ?? current.weatherCode)
    : current.weatherCode;
  const humidity = isForecast
    ? (() => {
        const start = dayIndex * 24;
        return average(hourly.relativeHumidity2m.slice(start, start + 24));
      })()
    : current.relativeHumidity2m;
  const windKmh = roundWindKmh(
    isForecast ? getForecastPeakWindKmh(weather, dayIndex) : current.windSpeed10m
  );
  const precipProbability = isForecast
    ? (daily.precipitationProbabilityMax[dayIndex] ?? 0)
    : Math.max(...hourly.precipitationProbability.slice(0, 8), 0);
  const uv = isForecast
    ? (daily.uvIndexMax?.[dayIndex] ?? 0)
    : (hourly.uvIndex?.[0] ?? 0);
  const temp = isForecast
    ? (daily.temperature2mMax[dayIndex] ?? current.temperature2m)
    : current.temperature2m;
  const feelsLike = isForecast ? temp : current.apparentTemperature;
  const localHour = getLocalHour(weather.currentTime);

  const hasStorm = weatherCode >= 95;
  const hasSnow = (current.snowfall > 0 && !isForecast) || (weatherCode >= 71 && weatherCode <= 77);
  const hasRain =
    hasStorm ||
    (!isForecast && (current.precipitation > 0 || current.rain > 0 || current.showers > 0)) ||
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82) ||
    precipProbability >= 60;

  if (hasStorm) {
    signals.push({
      category: "storm",
      priority: 100,
      primary: [
        "Thunderstorm conditions are active, so it is safest to stay indoors.",
        "Storm risk is high right now, so outdoor plans are better postponed.",
      ],
      secondary: [
        "wind can shift quickly through the day",
        "rain intensity may spike with little warning",
      ],
    });
  }

  if (hasSnow) {
    signals.push({
      category: "snow",
      priority: 95,
      primary: [
        "Snow is expected, so warm layers and slower travel are a good idea.",
        "Wintry conditions are likely, so plan extra time for your commute.",
      ],
      secondary: [
        "surfaces can turn slippery in shaded spots",
        "visibility can dip during heavier bursts",
      ],
    });
  }

  if (hasRain) {
    signals.push({
      category: "rain",
      priority: 90,
      primary: [
        "Light rain is likely, so carrying an umbrella is a smart call.",
        "Showers are in the forecast, so keep rain gear close by.",
        "Rain is in the picture today, so expect a wetter commute.",
      ],
      secondary: [
        "wind may make it feel cooler than expected",
        "roads can become slick during brief heavier spells",
      ],
    });
  }

  if (windKmh > 20) {
    signals.push({
      category: "wind",
      priority: 80,
      primary: [
        `Winds near ${windKmh} km/h are notable, so use extra caution outdoors.`,
        `Breezy conditions around ${windKmh} km/h are expected, especially in open areas.`,
      ],
      secondary: [
        "gusts may feel stronger near buildings and crossings",
        "light rain can feel sharper with this wind",
      ],
    });
  }

  if (humidity > 80) {
    signals.push({
      category: "humidity",
      priority: 70,
      primary: [
        "Humidity is high, so it may feel warmer than the thermometer suggests.",
        "Moist air is elevated, so conditions can feel a bit heavier outdoors.",
      ],
      secondary: [
        "comfort improves with lighter, breathable clothing",
        "hydration helps if you are outside for long",
      ],
    });
  }

  if (feelsLike >= 35) {
    signals.push({
      category: "heat",
      priority: 68,
      primary: [
        "Heat stress risk is elevated, so shade and hydration are important.",
        "It will feel quite hot outdoors, so pace activities through cooler hours.",
      ],
      secondary: [
        "direct sun can push perceived heat even higher",
        "lighter clothing will feel more comfortable",
      ],
    });
  }

  if (temp <= 5 || feelsLike <= 2) {
    signals.push({
      category: "cold",
      priority: 64,
      primary: [
        "Cold air is in place, so layering up will keep outdoor time comfortable.",
        "Chilly conditions are expected, so a warm outer layer is recommended.",
      ],
      secondary: [
        "wind can make exposed areas feel colder",
        "morning hours are likely to feel the sharpest",
      ],
    });
  }

  if (uv >= 7) {
    signals.push({
      category: "uv",
      priority: 60,
      primary: [
        "UV intensity is high, so sunscreen and sunglasses are strongly recommended.",
        "Sun exposure is elevated, so protection is a good idea for longer outings.",
      ],
      secondary: [
        "seek shade during midday when possible",
        "reapply sunscreen if staying outdoors",
      ],
    });
  }

  if (weatherCode === 0 && localHour !== null && localHour >= 18 && localHour < 23) {
    signals.push({
      category: "clear",
      priority: 50,
      primary: [
        "Clear skies this evening should give excellent visibility.",
        "Tonight looks clear and calm, ideal for a comfortable evening outside.",
      ],
      secondary: [
        "temperatures usually ease down after sunset",
        "visibility should remain crisp through the evening",
      ],
    });
  }

  return signals;
}

export function generateWeatherInsight(
  weather: WeatherData,
  dayIndex: number = -1
): WeatherInsight {
  if (!weather || !weather.daily || !weather.hourly || !weather.current) {
    return {
      message: "Weather details are still loading. Insights will appear in a moment.",
      category: "default",
      priority: 0,
    };
  }

  const seed = getSeed(weather, dayIndex);
  const signals = buildSignals(weather, dayIndex).sort((a, b) => b.priority - a.priority);

  if (signals.length === 0) {
    const code = dayIndex >= 0
      ? (weather.daily.weatherCode[dayIndex] ?? weather.current.weatherCode)
      : weather.current.weatherCode;
    const condition = getWeatherConditionText(code).toLowerCase();
    return {
      message: `Conditions look ${condition}, with generally stable weather for now.`,
      category: "default",
      priority: 0,
    };
  }

  const primary = signals[0];
  if (!primary) {
    return {
      message: "Conditions are fairly steady right now.",
      category: "default",
      priority: 0,
    };
  }

  const secondary = signals
    .filter((signal) => signal.category !== primary.category && signal.priority >= 60)
    .slice(0, 2)
    .map((signal, index) => pickVariant(signal.secondary, seed + (index + 1) * 23));

  const primaryMessage = pickVariant(primary.primary, seed + 11);
  let message = primaryMessage;

  if (secondary.length === 1) {
    const connector = pickVariant(["Also,", "At the same time,", "On top of that,"], seed + 31);
    message = `${primaryMessage} ${connector} ${secondary[0]}.`;
  } else if (secondary.length === 2) {
    const connector = pickVariant(["Also,", "In addition,"], seed + 37);
    message = `${primaryMessage} ${connector} ${secondary[0]}, and ${secondary[1]}.`;
  }

  return {
    message,
    category: primary.category,
    priority: primary.priority,
  };
}
