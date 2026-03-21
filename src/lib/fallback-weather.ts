import { WeatherData } from "@/types/weather";

function toIsoHour(base: Date, hourOffset: number): string {
  return new Date(base.getTime() + hourOffset * 60 * 60 * 1000).toISOString();
}

function toIsoDate(base: Date, dayOffset: number): string {
  const d = new Date(base);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  return d.toISOString().slice(0, 10);
}

function toSunTime(baseDate: string, hour: number, minute = 0): string {
  const d = new Date(`${baseDate}T00:00:00.000Z`);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function createFallbackWeatherData(): WeatherData {
  const now = new Date();
  const totalHours = 24 * 10;
  const totalDays = 10;

  const hourlyTime = Array.from({ length: totalHours }, (_, i) => toIsoHour(now, i));
  const dailyTime = Array.from({ length: totalDays }, (_, i) => toIsoDate(now, i));

  const hourlyTemperature = Array.from({ length: totalHours }, (_, i) => {
    const dayWave = Math.sin((i % 24) / 24 * Math.PI * 2);
    return Math.round((22 + dayWave * 5) * 10) / 10;
  });

  const hourlyHumidity = Array.from({ length: totalHours }, (_, i) => {
    const wave = Math.cos((i % 24) / 24 * Math.PI * 2);
    return Math.round(65 + wave * 12);
  });

  const hourlyApparent = hourlyTemperature.map((t, i) => t + (i % 6 === 0 ? 0.6 : 0.2));
  const hourlyPrecipProb = Array.from({ length: totalHours }, (_, i) => ((i + 4) % 12 === 0 ? 35 : 8));
  const hourlyPrecip = hourlyPrecipProb.map((p) => (p > 20 ? 0.4 : 0));
  const hourlyWeatherCode = Array.from({ length: totalHours }, (_, i) => ((i + 6) % 36 === 0 ? 61 : 2));
  const hourlyVisibility = Array.from({ length: totalHours }, () => 10000);
  const hourlyWind = Array.from({ length: totalHours }, (_, i) => 10 + (i % 8));
  const hourlyUv = Array.from({ length: totalHours }, (_, i) => {
    const h = i % 24;
    if (h < 6 || h > 18) return 0;
    return Math.max(0, Math.round((1 - Math.abs(12 - h) / 7) * 7));
  });

  const dailyWeatherCode = Array.from({ length: totalDays }, (_, i) => (i % 4 === 0 ? 3 : 1));
  const dailyTempMax = Array.from({ length: totalDays }, (_, i) => 26 + (i % 3));
  const dailyTempMin = Array.from({ length: totalDays }, (_, i) => 17 + (i % 2));
  const dailySunrise = dailyTime.map((day) => toSunTime(day, 6, 10));
  const dailySunset = dailyTime.map((day) => toSunTime(day, 18, 5));
  const dailyUvMax = Array.from({ length: totalDays }, (_, i) => 6 + (i % 2));
  const dailyPrecipSum = Array.from({ length: totalDays }, (_, i) => (i % 4 === 0 ? 1.4 : 0.2));
  const dailyPrecipProbMax = Array.from({ length: totalDays }, (_, i) => (i % 4 === 0 ? 50 : 18));

  return {
    current: {
      temperature2m: hourlyTemperature[0] ?? 22,
      relativeHumidity2m: hourlyHumidity[0] ?? 65,
      apparentTemperature: hourlyApparent[0] ?? 22.4,
      isDay: now.getHours() >= 6 && now.getHours() < 18 ? 1 : 0,
      precipitation: hourlyPrecip[0] ?? 0,
      rain: hourlyPrecip[0] ?? 0,
      showers: 0,
      snowfall: 0,
      weatherCode: hourlyWeatherCode[0] ?? 2,
      cloudCover: 35,
      pressureMsl: 1014,
      surfacePressure: 1008,
      windSpeed10m: hourlyWind[0] ?? 12,
      windDirection10m: 220,
      windGusts10m: 20,
    },
    hourly: {
      time: hourlyTime,
      temperature2m: hourlyTemperature,
      relativeHumidity2m: hourlyHumidity,
      apparentTemperature: hourlyApparent,
      precipitationProbability: hourlyPrecipProb,
      precipitation: hourlyPrecip,
      weatherCode: hourlyWeatherCode,
      visibility: hourlyVisibility,
      windSpeed10m: hourlyWind,
      uvIndex: hourlyUv,
    },
    daily: {
      time: dailyTime,
      weatherCode: dailyWeatherCode,
      temperature2mMax: dailyTempMax,
      temperature2mMin: dailyTempMin,
      sunrise: dailySunrise,
      sunset: dailySunset,
      uvIndexMax: dailyUvMax,
      precipitationSum: dailyPrecipSum,
      precipitationProbabilityMax: dailyPrecipProbMax,
    },
    airQuality: {
      usAqi: 58,
      pm10: 21,
      pm2_5: 12,
      carbonMonoxide: 190,
      nitrogenDioxide: 12,
      sulphurDioxide: 4,
      ozone: 48,
    },
  };
}
