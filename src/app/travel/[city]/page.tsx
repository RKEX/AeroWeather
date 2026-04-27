import { CityFeatureTemplate } from "@/components/seo/city-feature-template";
import { searchLocations } from "@/lib/geocode";
import { getSeoContent } from "@/lib/seo-content-data";
import { getWeatherData } from "@/lib/weather-api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { POPULAR_CITIES } from "@/config/cities";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return POPULAR_CITIES.map((city) => ({
    city,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const normalizedCity = decodeURIComponent(city).toLowerCase();
  const cityName = normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1);
  
  return {
    title: `Travel Weather Intelligence for ${cityName} – Planning Guide`,
    description: `Expert travel weather planning for ${cityName}. Optimize your trip based on visibility, wind, and local climate intelligence.`,
    alternates: {
      canonical: `https://www.aeroweather.app/travel/${encodeURIComponent(normalizedCity)}`,
    },
  };
}

export default async function CityTravelPage({ params }: Props) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);

  let weather: Awaited<ReturnType<typeof getWeatherData>>;
  let content: ReturnType<typeof getSeoContent>;

  try {
    const locations = await searchLocations(decodedCity);
    if (!locations || locations.length === 0) {
      notFound();
    }

    const location = locations[0];
    weather = await getWeatherData(location.latitude, location.longitude);
    content = getSeoContent(decodedCity, "travel");
  } catch (error) {
    console.error(`Error loading travel page for ${city}:`, error);
    notFound();
  }

  return (
    <CityFeatureTemplate
      city={decodedCity}
      feature="travel"
      weatherData={weather}
      content={content}
    />
  );
}
