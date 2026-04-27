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
    title: `Dating & Relationship Weather in ${cityName} – Social Insights`,
    description: `Is today a good day for a date in ${cityName}? Discover how weather impacts social friction and romance using AI insights.`,
    alternates: {
      canonical: `https://www.aeroweather.app/love/${city}`,
    },
  };
}

export default async function CityLovePage({ params }: Props) {
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
    content = getSeoContent(decodedCity, "love");
  } catch (error) {
    console.error(`Error loading love page for ${city}:`, error);
    notFound();
  }

  return (
    <CityFeatureTemplate
      city={decodedCity}
      feature="love"
      weatherData={weather}
      content={content}
    />
  );
}
