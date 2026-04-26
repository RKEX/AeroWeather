import { FounderSeoLinks } from "@/components/home/founder-seo-links";
import { HomeContent } from "@/components/home/home-content";
import ClientDashboard from "@/components/weather/client-dashboard";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import { createFallbackWeatherData } from "@/lib/fallback-weather";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type HomePageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveUiLanguageFromRequest();
  const dictionary = await getLocaleDictionary(language);

  return generateMetadataFromConfig({
    title: dictionary.appTagline,
    description: dictionary.footerDescription,
    locale: language,
    pathname: "/",
  });
}

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

      <HomeContent />

      <FounderSeoLinks />
    </>
  );
}