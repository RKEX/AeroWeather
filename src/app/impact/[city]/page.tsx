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
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  
  return {
    title: `Weather Impact in ${cityName} – Mood, Travel & Life Insights`,
    description: `Discover how weather affects mood, relationships, and daily life in ${cityName} using AI insights.`,
    alternates: {
      canonical: `https://www.aeroweather.app/impact/${city}`,
    },
  };
}

export default async function CityImpactPage({ params }: Props) {
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
    content = getSeoContent(decodedCity, "impact");
  } catch (error) {
    console.error(`Error loading impact page for ${city}:`, error);
    notFound();
  }

  return (
    <CityFeatureTemplate
      city={decodedCity}
      feature="impact"
      weatherData={weather}
      content={content}
    />
  );
}
