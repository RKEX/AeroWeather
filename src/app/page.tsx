import ClientDashboard from "@/components/weather/client-dashboard";
import { constructMetadata, metadataConfig } from "@/config/metadata";
import { createFallbackWeatherData } from "@/lib/fallback-weather";

export const metadata = constructMetadata({
  title: metadataConfig.home.title,
  description: metadataConfig.home.description,
});

export const revalidate = 60;
export default async function Home() {
  const defaultLat = 40.7128;
  const defaultLon = -74.006;
  const initialWeather = createFallbackWeatherData();

  return (
    <ClientDashboard
      initialWeather={initialWeather}
      initialLocation={{ lat: defaultLat, lon: defaultLon, name: "New York" }}
    />
  );
}
