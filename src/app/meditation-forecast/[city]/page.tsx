import { WeatherSlugClient } from "@/components/weather/weather-slug-client";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import { searchLocations } from "@/lib/geocode";
import { resolveUiLanguageFromRequest, type SearchParamsRecord } from "@/lib/route-locale";
import { getWeatherData } from "@/lib/weather-api";
import { Metadata } from "next";

interface Props {
  params: Promise<{ city: string }>;
  searchParams?: Promise<SearchParamsRecord>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const language = await resolveUiLanguageFromRequest();
  const decodedCity = decodeURIComponent(city).replace(/-/g, " ");
  const displayCity = decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1);

  return generateMetadataFromConfig({
    title: `Mental Clarity & Meditation Forecast in ${displayCity} | Focus & Stress Insights`,
    description: `Track your focus, stress, and mental clarity in ${displayCity} using weather-based intelligence. Discover today's mental clarity, focus level, and stress insights in ${displayCity}. Powered by weather-based intelligence.`,
    keywords: ["mental clarity", "focus forecast", "stress index", "meditation insights", "weather based intelligence"],
    pathname: `/meditation-forecast/${city.toLowerCase()}`,
    locale: language,
    type: "article",
  });
}

export default async function MeditationForecastPage({ params }: Props) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city).replace(/-/g, " ");

  let lat = 40.7128;
  let lon = -74.006;
  let name = decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1);

  try {
    const locations = await searchLocations(decodedCity);
    if (locations && locations.length > 0) {
      lat = locations[0].latitude;
      lon = locations[0].longitude;
      name = locations[0].name;
    }
  } catch (e) {
    console.error("Meditation forecast geocoding error:", e);
  }

  const weather = await getWeatherData(lat, lon);
  const pageUrl = `https://www.aeroweather.app/meditation-forecast/${city.toLowerCase()}`;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Mental Clarity & Meditation Forecast in ${name}`,
    description: `Track your focus, stress, and mental clarity in ${name} using weather-based intelligence.`,
    url: pageUrl,
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Mental Clarity & Meditation Forecast in ${name} | Focus & Stress Insights`,
    description: `Discover today's mental clarity, focus level, and stress insights in ${name}. Powered by weather-based intelligence.`,
    datePublished: new Date().toISOString().split("T")[0],
    about: {
      "@type": "Thing",
      name: "mental health, meditation, stress, focus",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <WeatherSlugClient
        initialWeather={weather}
        locationName={name}
        slug={city.toLowerCase()}
        lat={lat}
        lon={lon}
      />
    </>
  );
}
