import { FounderSeoLinks } from "@/components/home/founder-seo-links";
import ClientDashboard from "@/components/weather/client-dashboard";
import { constructMetadata, metadataConfig } from "@/config/metadata";
import { createFallbackWeatherData } from "@/lib/fallback-weather";

export const metadata = constructMetadata({
  title: metadataConfig.home.title,
  description: metadataConfig.home.description,
});

export const revalidate = 60;
export default async function Home() {
  // ✅ Default location: Kolkata (New York এর বদলে)
  const defaultLat = 22.5726;
  const defaultLon = 88.3639;
  const initialWeather = createFallbackWeatherData();

  return (
    <>
      <ClientDashboard
        initialWeather={initialWeather}
        initialLocation={{ lat: defaultLat, lon: defaultLon, name: "Kolkata" }}
      />

      <FounderSeoLinks />
    </>
  );
}