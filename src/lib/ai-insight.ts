import { WeatherData } from "@/types/weather";
import { getWeatherConditionText } from "./weather-theme";

export function generateWeatherInsight(weather: WeatherData, dayIndex: number = -1): string {
  if (!weather || !weather.daily || !weather.hourly) return "Data unavailable for insights.";

  const { hourly, daily } = weather;

  // Use dayIndex to look at a specific day or fall back to current
  // dayIndex 0 is today, -1 usually means "current" (using current weather block)
  
  if (dayIndex === -1 && weather.current) {
    const { current } = weather;
    // 1. Check for immediate precipitation
    if (current.precipitation > 0) {
       if (current.snowfall > 0) return "It's currently snowing. Drive safely and dress warmly.";
       if (current.weatherCode >= 95) return "Thunderstorm active. Seek shelter and avoid open areas.";
       return "It's currently raining. Good time for an umbrella.";
    }

    // 2. Look ahead in the next 12 hours for rain/snow for today
    const next12HoursPrecipProb = hourly.precipitationProbability.slice(0, 12);
    const maxPrecipProb = Math.max(...next12HoursPrecipProb);
    
    if (maxPrecipProb > 70) {
        return "High chance of precipitation later today. Keep an umbrella handy.";
    } else if (maxPrecipProb > 40) {
        return "Moderate chance of rain later. Might want to carry a light jacket.";
    }

    // 3. Temperature extremes
    if (current.apparentTemperature > 35) {
        return "Heat warning: It feels very hot outside. Stay hydrated and avoid strenuous activities.";
    } else if (current.apparentTemperature < 0) {
        return "Freezing temperatures: It feels below freezing. Layer up if heading out.";
    }

    // 4. UV Index
    if (hourly.uvIndex && hourly.uvIndex[0] > 7) {
        return "High UV Index right now. Sunscreen and shades are highly recommended.";
    }
  }

  // Forecast Day specific insights if dayIndex >= 0
  if (dayIndex >= 0) {
    const code = daily.weatherCode[dayIndex];
    const maxTemp = daily.temperature2mMax[dayIndex];
    const precipProb = daily.precipitationProbabilityMax[dayIndex];
    const uvMax = daily.uvIndexMax?.[dayIndex] ?? 0;

    if (code >= 95) return "Heavy storms forecasted. Best to plan indoor activities.";
    if (code >= 71 && code <= 77) return "Snow is expected. Perfect for winter sports, but stay warm!";
    if (precipProb > 70) return "Rain is very likely. Don't forget your umbrella when heading out.";
    if (uvMax > 7) return "Very high UV levels expected. Make sure to wear protection.";
    if (maxTemp > 30) return "It will be quite hot. Stay hydrated and seek shade during peak hours.";
    if (maxTemp < 5) return "Cold day ahead. Make sure to bundle up properly.";
    if (code >= 1 && code <= 3) return "Partly cloudy and pleasant conditions expected.";
    if (code === 0) return "Clear blue skies ahead. A beautiful day to be outdoors!";
  }

  // Fallback for current or dayIndex
  const targetCode = dayIndex >= 0 ? daily.weatherCode[dayIndex] : (weather.current?.weatherCode ?? 0);
  const currentTemp = dayIndex >= 0 ? daily.temperature2mMax[dayIndex] : (weather.current?.temperature2m ?? 0);
  const condition = getWeatherConditionText(targetCode);
  return `Expect ${condition} throughout the day, with highs around ${Math.round(currentTemp)}°C.`;
}
