import { CityLongContent } from "@/components/weather/city-long-content";
import { WeatherSlugClient } from "@/components/weather/weather-slug-client";

import { generateMetadataFromConfig } from "@/config/seoconfig";
import { resolveDayIndex } from "@/lib/day-slug";
import { searchLocations } from "@/lib/geocode";
import {
    getLocaleDictionary,
    interpolateLocaleText,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { getWeatherData } from "@/lib/weather-api";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SearchParamsRecord>;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const language = await resolveUiLanguageFromRequest();
  const dictionary = await getLocaleDictionary(language);
  const decodedSlug = decodeURIComponent(slug);
  const metadataPathname = `/weather/${decodedSlug.toLowerCase()}`;

  // 1. Check if it's a day slug
  const dummyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const dayIndex = resolveDayIndex(decodedSlug.toLowerCase(), dummyDates);

  if (dayIndex >= 0) {
    const dayName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
    const dayTitle = `${dayName} Weather Forecast & AQI – Live Radar & Predictions`;
    return generateMetadataFromConfig({
      title: dayTitle,
      description: `Get the detailed ${dayName} weather forecast. Real-time updates on temperature, humidity, wind, and air quality for your location. Plan your day with AeroWeather intelligence.`,
      locale: language,
      pathname: metadataPathname,
    });
  }

  // 2. Otherwise assume it's a city
  try {
    const locations = await searchLocations(decodedSlug);
    if (locations && locations.length > 0) {
      const city = locations[0].name;
      const cityTitle = `${city} Weather Forecast & AQI – Live Radar Maps`;
      return generateMetadataFromConfig({
        title: cityTitle,
        description: `Current weather in ${city}. Detailed hourly and 7-day forecast, interactive radar, and real-time air quality index (AQI) reports for ${city}.`,
        locale: language,
        pathname: metadataPathname,
      });
    }
  } catch (e) {
    console.error("Metadata geocoding error:", e);
  }

  return generateMetadataFromConfig({
    title: `${decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)} Weather`,
    description: `Real-time weather intelligence and forecast for ${decodedSlug}.`,
    locale: language,
    pathname: metadataPathname,
  });
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
      } else {
        name = decodedSlug;
      }
    } catch (e) {
      console.error("Geocoding error in page:", e);
    }
  }

  const weather = await getWeatherData(lat, lon);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.aeroweather.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Weather",
        "item": "https://www.aeroweather.app/weather"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": name,
        "item": `https://www.aeroweather.app/weather/${decodedSlug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <WeatherSlugClient 
        initialWeather={weather} 
        locationName={name}
        slug={decodedSlug.toLowerCase()}
        lat={lat}
        lon={lon}
      />
      
      <CityLongContent slug={decodedSlug.toLowerCase()} />
    </>
  );
}
