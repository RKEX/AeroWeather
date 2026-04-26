import { WeatherSlugClient } from "@/components/weather/weather-slug-client";
import { LoveSeoContent } from "@/components/weather/love-seo-content";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import { searchLocations } from "@/lib/geocode";
import { resolveUiLanguageFromRequest, type SearchParamsRecord } from "@/lib/route-locale";
import { generateLoveJsonLd, generateLoveSeoContent } from "@/lib/love-seo";
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
  const seoContent = generateLoveSeoContent(displayCity);

  return generateMetadataFromConfig({
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
    pathname: `/love-forecast/${city.toLowerCase()}`,
    locale: language,
    type: "article",
  });
}

export default async function LoveForecastPage({ params }: Props) {
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
    console.error("Love forecast geocoding error:", e);
  }

  const weather = await getWeatherData(lat, lon);
  const pageUrl = `https://www.aeroweather.app/love-forecast/${city.toLowerCase()}`;
  const { webPage, faqSchema, breadcrumb } = generateLoveJsonLd(name, pageUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <WeatherSlugClient
        initialWeather={weather}
        locationName={name}
        slug={city.toLowerCase()}
        lat={lat}
        lon={lon}
      />
      <LoveSeoContent city={name} slug={city.toLowerCase()} />
    </>
  );
}
