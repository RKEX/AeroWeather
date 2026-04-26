import { WeatherData } from "@/types/weather";
import { createFallbackWeatherData } from "./fallback-weather";
import { getCachedOpenMeteoData } from "./open-meteo-weather";

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const { data } = await getCachedOpenMeteoData(lat, lon);
    return data;

  } catch (error) {
    console.error("Error in getWeatherData:", error);
    return createFallbackWeatherData();
  }
}
