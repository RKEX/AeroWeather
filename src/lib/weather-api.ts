import { WeatherData } from "@/types/weather";
import { windFromApi, windSeriesFromApi } from "./wind";

// Core API endpoints
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    // 1. Fetch Weather Data (Current, Hourly, Daily)
    const weatherUrl = new URL(WEATHER_API_URL);
    weatherUrl.searchParams.append("latitude", lat.toString());
    weatherUrl.searchParams.append("longitude", lon.toString());
    weatherUrl.searchParams.append("timezone", "auto");
    
    // Current
    weatherUrl.searchParams.append("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m");
    
    // Hourly (Next 24h approximation, will slice later)
    weatherUrl.searchParams.append("hourly", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,uv_index");
    
    // Daily (10 days)
    weatherUrl.searchParams.append("daily", "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max");
    weatherUrl.searchParams.append("forecast_days", "10");

    const weatherRes = await fetch(weatherUrl.toString(), { next: { revalidate: 60 } }); // Cache for 60 seconds
    
    if (!weatherRes.ok) throw new Error("Failed to fetch weather data");
    const weatherData = await weatherRes.json();

    // 2. Fetch Air Quality Data
    const aqiUrl = new URL(AQI_API_URL);
    aqiUrl.searchParams.append("latitude", lat.toString());
    aqiUrl.searchParams.append("longitude", lon.toString());
    aqiUrl.searchParams.append("timezone", "auto");
    aqiUrl.searchParams.append("current", "us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone");

    let aqiData = null;
    try {
        const aqiRes = await fetch(aqiUrl.toString(), { next: { revalidate: 3600 } }); // Cache AQI for 1 hour
        if (aqiRes.ok) {
           const aqiJson = await aqiRes.json();
           aqiData = aqiJson.current;
        }
    } catch(e) {
        console.warn("AQI fetch failed, continuing without it", e);
    }

    // Format response
    return {
      timezone: weatherData.timezone,
      currentTime: weatherData.current?.time,
      utcOffsetSeconds: weatherData.utc_offset_seconds,
      current: {
        temperature2m: weatherData.current.temperature_2m,
        relativeHumidity2m: weatherData.current.relative_humidity_2m,
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
        windSpeed10m: windFromApi(weatherData.current.wind_speed_10m),
        windDirection10m: weatherData.current.wind_direction_10m,
        windGusts10m: windFromApi(weatherData.current.wind_gusts_10m),
      },
      hourly: {
        time: weatherData.hourly.time,
        temperature2m: weatherData.hourly.temperature_2m,
        relativeHumidity2m: weatherData.hourly.relative_humidity_2m,
        apparentTemperature: weatherData.hourly.apparent_temperature,
        precipitationProbability: weatherData.hourly.precipitation_probability,
        precipitation: weatherData.hourly.precipitation,
        weatherCode: weatherData.hourly.weather_code,
        visibility: weatherData.hourly.visibility,
        windSpeed10m: windSeriesFromApi(weatherData.hourly.wind_speed_10m),
        uvIndex: weatherData.hourly.uv_index,
      },
      daily: {
        time: weatherData.daily.time,
        weatherCode: weatherData.daily.weather_code,
        temperature2mMax: weatherData.daily.temperature_2m_max,
        temperature2mMin: weatherData.daily.temperature_2m_min,
        sunrise: weatherData.daily.sunrise,
        sunset: weatherData.daily.sunset,
        uvIndexMax: weatherData.daily.uv_index_max,
        precipitationSum: weatherData.daily.precipitation_sum,
        precipitationProbabilityMax: weatherData.daily.precipitation_probability_max,
      },
      airQuality: aqiData ? {
        usAqi: aqiData.us_aqi,
        pm10: aqiData.pm10,
        pm2_5: aqiData.pm2_5,
        carbonMonoxide: aqiData.carbon_monoxide,
        nitrogenDioxide: aqiData.nitrogen_dioxide,
        sulphurDioxide: aqiData.sulphur_dioxide,
        ozone: aqiData.ozone,
      } : undefined
    };

  } catch (error) {
    console.error("Error in getWeatherData:", error);
    return null;
  }
}
