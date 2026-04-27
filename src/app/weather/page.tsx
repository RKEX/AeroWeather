import GlassCard from "@/components/ui/GlassCard";
import { POPULAR_CITIES } from "@/config/cities";
import type { Metadata, Route } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "City Weather Hub - Live Forecasts, AQI & Weather Intelligence",
  description:
    "Explore live weather forecasts, AQI, humidity, wind, and atmospheric insights for top cities worldwide with AeroWeather's weather hub.",
  alternates: {
    canonical: "https://www.aeroweather.app/weather",
  },
};

function formatCitySlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function WeatherPage() {
  const featuredCities = POPULAR_CITIES.slice(0, 24);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-16 md:py-24">
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl">
          Global Weather Hub
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/65">
          Find weather intelligence for major cities in one place. AeroWeather combines real-time
          forecast signals, air quality context, and practical atmospheric guidance so you can
          make smarter decisions every day. Select a city to view hourly weather trends, AQI,
          wind flow, and human-impact insights designed for travel planning, productivity, and
          daily routines.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {featuredCities.map((city) => (
          <GlassCard key={city} as="div" className="p-0 shadow-none">
            <Link
              href={`/weather/${city}` as Route}
              className="block rounded-2xl px-4 py-4 text-center text-sm font-bold text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              {formatCitySlug(city)}
            </Link>
          </GlassCard>
        ))}
      </section>
    </main>
  );
}
