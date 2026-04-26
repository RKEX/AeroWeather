import { WeatherData } from "@/types/weather";
import { windFromApi, windSeriesFromApi } from "./wind";
import { createFallbackWeatherData } from "./fallback-weather";
import { getMoonData } from "./moon";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const CACHE_TTL_MS = 15 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  data: WeatherData;
};

type OpenMeteoGlobalCache = {
  weatherCache: Map<string, CacheEntry>;
  inFlight: Map<string, Promise<WeatherData>>;
};

function getCacheStore(): OpenMeteoGlobalCache {
  const globalStore = globalThis as typeof globalThis & {
    __aeroweather_open_meteo_cache__?: OpenMeteoGlobalCache;
  };

  if (!globalStore.__aeroweather_open_meteo_cache__) {
    globalStore.__aeroweather_open_meteo_cache__ = {
      weatherCache: new Map<string, CacheEntry>(),
      inFlight: new Map<string, Promise<WeatherData>>(),
    };
  }

  return globalStore.__aeroweather_open_meteo_cache__;
}

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

async function fetchOpenMeteoData(lat: number, lon: number): Promise<WeatherData> {
  const weatherUrl = new URL(WEATHER_API_URL);
  weatherUrl.searchParams.append("latitude", lat.toString());
  weatherUrl.searchParams.append("longitude", lon.toString());
  weatherUrl.searchParams.append("timezone", "auto");
  weatherUrl.searchParams.append("current", "temperature_2m,relativehumidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,windspeed_10m,wind_direction_10m,wind_gusts_10m");
  weatherUrl.searchParams.append("hourly", "temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,windspeed_10m,uv_index");
  weatherUrl.searchParams.append("daily", "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max");
  weatherUrl.searchParams.append("forecast_days", "10");

  const aqiUrl = new URL(AQI_API_URL);
  aqiUrl.searchParams.append("latitude", lat.toString());
  aqiUrl.searchParams.append("longitude", lon.toString());
  aqiUrl.searchParams.append("timezone", "auto");
  aqiUrl.searchParams.append("current", "us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone");

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl.toString(), { cache: "no-store" }),
    fetch(aqiUrl.toString(), { cache: "no-store" }),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Open-Meteo weather failed with status ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();

  let aqiData: {
    us_aqi: number;
    pm10: number;
    pm2_5: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    ozone: number;
  } | null = null;

  if (aqiRes.ok) {
    const aqiJson = await aqiRes.json();
    aqiData = aqiJson.current ?? null;
  }

  return {
    timezone: weatherData.timezone,
    currentTime: weatherData.current?.time,
    utcOffsetSeconds: weatherData.utc_offset_seconds,
    current: {
      temperature2m: weatherData.current.temperature_2m,
      relativeHumidity2m: weatherData.current.relativehumidity_2m,
      apparentTemperature: weatherData.current.apparent_temperature,
      isDay: weatherData.current.is_day,
      precipitation: weatherData.current.precipitation,
      rain: weatherData.current.rain,
      showers: weatherData.current.showers,
      snowfall: weatherData.current.snowfall,
      weatherCode: weatherData.current.weather_code,
      cloudCover: weatherData.current.cloud_cover,
      pressureMsl: weatherData.current.pressure_msl,
      surfacePressure: weatherData.current.surface_pressure,
      windSpeed10m: windFromApi(weatherData.current.windspeed_10m),
      windDirection10m: weatherData.current.wind_direction_10m,
      windGusts10m: windFromApi(weatherData.current.wind_gusts_10m),
    },
    hourly: {
      time: weatherData.hourly.time,
      temperature2m: weatherData.hourly.temperature_2m,
      relativeHumidity2m: weatherData.hourly.relativehumidity_2m,
      apparentTemperature: weatherData.hourly.apparent_temperature,
      precipitationProbability: weatherData.hourly.precipitation_probability,
      precipitation: weatherData.hourly.precipitation,
      weatherCode: weatherData.hourly.weather_code,
      visibility: weatherData.hourly.visibility,
      windSpeed10m: windSeriesFromApi(weatherData.hourly.windspeed_10m),
      uvIndex: weatherData.hourly.uv_index,
    },
    daily: {
      time: weatherData.daily.time,
      weatherCode: weatherData.daily.weather_code,
      temperature2mMax: weatherData.daily.temperature_2m_max,
      temperature2mMin: weatherData.daily.temperature_2m_min,
      sunrise: weatherData.daily.sunrise,
      sunset: weatherData.daily.sunset,
      moonrise: new Array(weatherData.daily.time.length).fill(null),
      moonset: new Array(weatherData.daily.time.length).fill(null),
      uvIndexMax: weatherData.daily.uv_index_max,
      precipitationSum: weatherData.daily.precipitation_sum,
      precipitationProbabilityMax: weatherData.daily.precipitation_probability_max,
    },
    airQuality: aqiData
      ? {
          usAqi: aqiData.us_aqi,
          pm10: aqiData.pm10,
          pm2_5: aqiData.pm2_5,
          carbonMonoxide: aqiData.carbon_monoxide,
          nitrogenDioxide: aqiData.nitrogen_dioxide,
          sulphurDioxide: aqiData.sulphur_dioxide,
          ozone: aqiData.ozone,
        }
      : undefined,
    moon: (() => {
      const moon = getMoonData(lat, lon);
      return {
        moonrise: moon.moonrise?.toISOString() || null,
        moonset: moon.moonset?.toISOString() || null,
        phase: moon.phase,
        illumination: moon.illumination,
        phaseName: moon.phaseName
      };
    })(),
    dailyMoon: (() => {
      const moonrise: (string | null)[] = [];
      const moonset: (string | null)[] = [];
      const phase: number[] = [];
      const illumination: number[] = [];
      const phaseName: string[] = [];

      weatherData.daily.time.forEach((time: string) => {
        const d = new Date(time + "T12:00:00"); // Noon for daily phase
        const m = getMoonData(lat, lon, d);
        moonrise.push(m.moonrise?.toISOString() || null);
        moonset.push(m.moonset?.toISOString() || null);
        phase.push(m.phase);
        illumination.push(m.illumination);
        phaseName.push(m.phaseName);
      });

      return { moonrise, moonset, phase, illumination, phaseName };
    })()
  };
}

export async function getCachedOpenMeteoData(lat: number, lon: number): Promise<{ data: WeatherData; cacheHit: boolean }> {
  const store = getCacheStore();
  const key = cacheKey(lat, lon);
  const now = Date.now();

  const existing = store.weatherCache.get(key);
  if (existing && existing.expiresAt > now) {
    return { data: existing.data, cacheHit: true };
  }

  const ongoing = store.inFlight.get(key);
  if (ongoing) {
    return { data: await ongoing, cacheHit: true };
  }

  const requestPromise = fetchOpenMeteoData(lat, lon)
    .then((data) => {
      store.weatherCache.set(key, {
        data,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return data;
    })
    .catch((err) => {
      console.error("OpenMeteo fetch error, checking for stale cache:", err);
      const stale = store.weatherCache.get(key);
      if (stale) return { ...stale.data, isFallback: true };
      return createFallbackWeatherData();
    })
    .finally(() => {
      store.inFlight.delete(key);
    });

  store.inFlight.set(key, requestPromise);
  return { data: await requestPromise, cacheHit: false };
}
