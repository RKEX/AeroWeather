import React from "react";
import { getCityContent } from "@/lib/city-content";
import { LongTextBlock } from "@/components/content/long-text-block";

interface CityLongContentProps {
  slug: string;
}

export function CityLongContent({ slug }: CityLongContentProps) {
  const content = getCityContent(slug);

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <LongTextBlock 
          title={`All About ${content.name}`} 
          content={content.description} 
        />
        <LongTextBlock 
          title="Climate and Environment" 
          content={content.climate} 
        />
      </div>
      
      <div className="rounded-2xl border border-white/10 bg-indigo-500/5 p-8 md:p-12">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl text-white">Travel and Local Tips</h2>
        <p className="text-lg leading-relaxed text-white/70">
          {content.tips}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12 text-center">
        <h3 className="mb-4 text-xl font-bold text-white">Why Use AeroWeather for {content.name}?</h3>
        <p className="text-white/60">
          Our specialized data points for {content.name} include high-resolution radar and real-time AQI monitoring. Unlike generic weather apps, we provide a deep dive into the specific atmospheric conditions that affect this region, ensuring you are always one step ahead of the weather.
        </p>
      </div>
    </section>
  );
}
