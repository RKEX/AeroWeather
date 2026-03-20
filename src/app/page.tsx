import { constructMetadata, metadataConfig } from "@/config/metadata";
import { getWeatherData } from "@/lib/weather-api";

export const metadata = constructMetadata({
  title: metadataConfig.home.title,
  description: metadataConfig.home.description,
});
import { WeatherSkeleton } from "@/components/weather/weather-skeleton";
import { Suspense } from "react";
import ClientDashboard from "@/components/weather/client-dashboard";

export const revalidate = 60;
export default async function Home() {
  const defaultLat = 40.7128;
  const defaultLon = -74.006;
  const initialWeather = await getWeatherData(defaultLat, defaultLon);

  return (
    <Suspense fallback={<WeatherSkeleton />}>
      <ClientDashboard initialWeather={initialWeather} initialLocation={{ lat: defaultLat, lon: defaultLon, name: "New York" }} />
    </Suspense>
  );
}
