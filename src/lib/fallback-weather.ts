import { WeatherData } from "@/types/weather";

export function createFallbackWeatherData(): WeatherData {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  
  // Create dummy arrays for 10 days
  const dummyDates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return {
    timezone: "UTC",
    currentTime: now.toISOString(),
    isFallback: true,
    current: {
      temperature2m: 0,
      relativeHumidity2m: 0,
      apparentTemperature: 0,
      isDay: 1,
      precipitation: 0,
      rain: 0,
      showers: 0,
      snowfall: 0,
      weatherCode: 0,
      cloudCover: 0,
      pressureMsl: 1013,
      surfacePressure: 1013,
      windSpeed10m: 0,
      windDirection10m: 0,
      windGusts10m: 0,
    },
    hourly: {
      time: Array.from({ length: 240 }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() + i);
        return d.toISOString();
      }),
      temperature2m: new Array(240).fill(0),
      relativeHumidity2m: new Array(240).fill(0),
      apparentTemperature: new Array(240).fill(0),
      precipitationProbability: new Array(240).fill(0),
      precipitation: new Array(240).fill(0),
      weatherCode: new Array(240).fill(0),
      visibility: new Array(240).fill(10000),
      windSpeed10m: new Array(240).fill(0),
      uvIndex: new Array(240).fill(0),
    },
    daily: {
      time: dummyDates,
      weatherCode: new Array(10).fill(0),
      temperature2mMax: new Array(10).fill(0),
      temperature2mMin: new Array(10).fill(0),
      sunrise: new Array(10).fill(`${today}T06:00`),
      sunset: new Array(10).fill(`${today}T18:00`),
      moonrise: new Array(10).fill(`${today}T20:00`),
      moonset: new Array(10).fill(`${today}T04:00`),
      uvIndexMax: new Array(10).fill(0),
      precipitationSum: new Array(10).fill(0),
      precipitationProbabilityMax: new Array(10).fill(0),
    },
    moon: {
      moonrise: null,
      moonset: null,
      phase: 0,
      illumination: 0,
      phaseName: "New Moon",
    },
    dailyMoon: {
      moonrise: new Array(10).fill(null),
      moonset: new Array(10).fill(null),
      phase: new Array(10).fill(0),
      illumination: new Array(10).fill(0),
      phaseName: new Array(10).fill("New Moon"),
    }
  };
}
