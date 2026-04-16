/* eslint-disable @typescript-eslint/no-explicit-any */
import { windFromApi, windSeriesFromApi } from "../lib/wind";

self.onmessage = async (e: MessageEvent) => {
  const { weatherUrl, aqiUrl } = e.data;

  try {
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Failed to fetch weather data");
    const weatherData = await weatherRes.json();

    let aqiData = null;
    try {
      const aqiRes = await fetch(aqiUrl);
      if (aqiRes.ok) {
        const aqiJson = await aqiRes.json();
        aqiData = aqiJson.current;
      }
    } catch (err) {
      console.warn("AQI fetch failed in worker", err);
    }

    const formattedData = {
      timezone: weatherData.timezone, // ✅ TOP LEVEL এ
      currentTime: weatherData.current?.time,
      utcOffsetSeconds: weatherData.utc_offset_seconds,
      current: {
        // timezone নেই এখানে
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
      } : undefined,
    };

    self.postMessage({ type: "SUCCESS", data: formattedData });
  } catch (error: any) {
    self.postMessage({ type: "ERROR", error: error.message });
  }
};