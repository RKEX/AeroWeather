import { WeatherData } from "@/types/weather";

export function generateWeatherInsight(weather: WeatherData): string {
  if (!weather || !weather.current || !weather.hourly) return "Data unavailable for insights.";

  const { current, hourly, daily } = weather;
  
  // 1. Check for immediate precipitation
  if (current.precipitation > 0) {
     if (current.snowfall > 0) return "It's currently snowing. Drive safely and dress warmly.";
     if (current.weatherCode >= 95) return "Thunderstorm active. Seek shelter and avoid open areas.";
     return "It's currently raining. Good time for an umbrella.";
  }

  // 2. Look ahead in the next 12 hours for rain/snow
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

  // 5. High Winds
  if (current.windSpeed10m > 30 || current.windGusts10m > 50) {
      return "Strong winds detected. Be careful of flying debris and secure outdoor items.";
  }

  // 6. General pleasant conditions
  if (current.cloudCover < 30 && current.apparentTemperature > 18 && current.apparentTemperature < 28) {
      return "Perfect weather out there! Great day for outdoor activities.";
  }

  // Fallback
  const conditions = [
    current.cloudCover > 50 ? "Cloudy skies" : "Clear skies",
    `feeling like ${Math.round(current.apparentTemperature)}°C`
  ];
  return `${conditions.join(', ')}. Expect stable conditions for the next few hours.`;
}
