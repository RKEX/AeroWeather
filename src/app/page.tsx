import ClientDashboard from "@/components/weather/client-dashboard";
import { constructMetadata, metadataConfig } from "@/config/metadata";
import { createFallbackWeatherData } from "@/lib/fallback-weather";
import Link from "next/link";

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

      <section className="mx-auto max-w-7xl px-4 pb-2">
        <p className="text-center text-xs text-white/60">
          Founded by{" "}
          <Link href="/rick-das" className="text-indigo-300 underline hover:text-indigo-200">
            Rick Das
          </Link>
        </p>
      </section>
    </>
  );
}