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
    title: `Dating Weather in ${displayCity} – ${seoContent.title}`,
    description: `Discover the best dating weather conditions in ${displayCity}. ${seoContent.description}`,
    keywords: [...seoContent.keywords, `dating weather ${displayCity}`, `best dating day ${displayCity}`],
    pathname: `/dating-weather/${city.toLowerCase()}`,
    locale: language,
    type: "article",
  });
}

export default async function DatingWeatherPage({ params }: Props) {
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
    console.error("Dating weather geocoding error:", e);
  }

  const weather = await getWeatherData(lat, lon);
  const pageUrl = `https://www.aeroweather.app/dating-weather/${city.toLowerCase()}`;
  const { webPage, faqSchema, breadcrumb } = generateLoveJsonLd(name, pageUrl);

  // Adjust breadcrumb for this route
  breadcrumb.itemListElement[1] = {
    "@type": "ListItem",
    position: 2,
    name: "Dating Weather",
    item: "https://www.aeroweather.app/dating-weather",
  };

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
