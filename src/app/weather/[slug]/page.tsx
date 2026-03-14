import { resolveDayIndex } from "@/lib/day-slug";
import { searchLocations } from "@/lib/geocode";
import { getWeatherData } from "@/lib/weather-api";
import { WeatherSlugClient } from "@/components/weather/weather-slug-client";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  // 1. Check if it's a day slug
  const dummyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const dayIndex = resolveDayIndex(decodedSlug.toLowerCase(), dummyDates);

  if (dayIndex >= 0) {
    const dayName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
    return {
      title: `${dayName} Weather Forecast | AeroWeather`,
      description: `Get the detailed weather forecast for ${decodedSlug} including temperature, metrics, and AI insights.`,
    };
  }

  // 2. Otherwise assume it's a city
  try {
    const locations = await searchLocations(decodedSlug);
    if (locations && locations.length > 0) {
      const city = locations[0].name;
      return {
        title: `${city} Weather Today | AeroWeather`,
        description: `Live weather forecast for ${city} including hourly temperature, 7-day forecast, humidity, wind speed, and radar.`,
      };
    }
  } catch (e) {
    console.error("Metadata geocoding error:", e);
  }

  return {
    title: "Weather Forecast | AeroWeather",
    description: "Check current weather and forecasts for any city.",
  };
}

export default async function WeatherSlugPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Resolve Day Index (for dummy check)
  const dummyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const dayIndex = resolveDayIndex(decodedSlug.toLowerCase(), dummyDates);

  let lat = 40.7128;
  let lon = -74.006;
  let name = "New York";

  if (dayIndex === -1) {
    // It's a city slug
    try {
      const locations = await searchLocations(decodedSlug);
      if (locations && locations.length > 0) {
        lat = locations[0].latitude;
        lon = locations[0].longitude;
        name = locations[0].name;
      }
    } catch (e) {
      console.error("Geocoding error in page:", e);
    }
  }

  const weather = await getWeatherData(lat, lon);

  if (!weather) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <p className="text-white/60">Failed to load weather data.</p>
      </div>
    );
  }

  return (
    <WeatherSlugClient 
      initialWeather={weather} 
      locationName={name}
      slug={decodedSlug.toLowerCase()}
    />
  );
}
