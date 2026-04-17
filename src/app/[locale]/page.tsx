import { FounderSeoLinks } from "@/components/home/founder-seo-links";
import ClientDashboard from "@/components/weather/client-dashboard";
import { constructMetadata } from "@/config/metadata";
import { createFallbackWeatherData } from "@/lib/fallback-weather";
import { getLocaleDictionary } from "@/lib/route-locale";
import {
  normalizeSupportedLocale,
  type SupportedLocale,
} from "@/lib/locales";
import { Metadata } from "next";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeSupportedLocale(locale) as SupportedLocale;
  const dictionary = await getLocaleDictionary(language);

  return constructMetadata({
    title: dictionary.appTagline,
    description: dictionary.footerDescription,
    locale: language,
    pathname: "/",
  });
}

export const revalidate = 60;

export default async function HomePage() {
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