import { WeatherSlugClient } from "@/components/weather/weather-slug-client";
import { WeatherSlugError } from "@/components/weather/weather-slug-error";
import { constructMetadata } from "@/config/metadata";
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
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const language = await resolveUiLanguageFromRequest(resolvedSearchParams);
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
    return constructMetadata({
      title: `${dayName} ${dictionary.forecastWord}`,
      description: interpolateLocaleText(dictionary.weatherIn, { city: dayName }),
      locale: language,
      pathname: metadataPathname,
    });
  }

  // 2. Otherwise assume it's a city
  try {
    const locations = await searchLocations(decodedSlug);
    if (locations && locations.length > 0) {
      const city = locations[0].name;
      return constructMetadata({
        title: `${city} ${dictionary.forecastWord}`,
        description: interpolateLocaleText(dictionary.weatherIn, { city }),
        locale: language,
        pathname: metadataPathname,
      });
    }
  } catch (e) {
    console.error("Metadata geocoding error:", e);
  }

  return constructMetadata({
    title: dictionary.forecastWord,
    description: dictionary.footerDescription,
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
      }
    } catch (e) {
      console.error("Geocoding error in page:", e);
    }
  }

  const weather = await getWeatherData(lat, lon);

  if (!weather) {
    return <WeatherSlugError />;
  }

  return (
    <WeatherSlugClient 
      initialWeather={weather} 
      locationName={name}
      slug={decodedSlug.toLowerCase()}
    />
  );
}
