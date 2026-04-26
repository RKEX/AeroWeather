import React from "react";
import { LongTextBlock } from "@/components/content/long-text-block";
import { FaqSection } from "@/components/content/faq-section";
import GlassCard from "@/components/ui/GlassCard";

const INTRO_TEXT = `AeroWeather is an ultra-premium weather intelligence platform designed for the modern era. We provide real-time, precision-driven meteorological data through a high-performance visual interface. Our mission is to transform complex atmospheric data into clear, actionable insights that help you plan your day with absolute confidence.

In an age where data is abundant but clarity is scarce, AeroWeather stands as a beacon of precision. We don't just tell you the temperature; we explain the environment. By integrating high-resolution satellite imagery with ground-level sensor arrays, we create a living map of the atmosphere. This commitment to detail ensures that whether you are navigating a daily commute or planning a cross-continental expedition, you have the highest fidelity information at your fingertips. Built with cutting-edge web technologies and powered by elite data sources, AeroWeather offers a comprehensive environmental overview, including air quality, interactive radar, and intelligent weather summaries interpreted by our advanced logic engine.`;

const TECH_TEXT = `At the heart of AeroWeather is a sophisticated data processing pipeline that integrates global weather models with hyper-local environmental sensors. Unlike traditional weather apps that rely on a single data point, we ingest data from multiple international organizations and verify it against real-time observations. Our architecture is built for resilience and speed, utilizing globally distributed nodes to ensure that your local forecast is always up-to-date, regardless of where you are on the planet.

Our system calculates the 'Feels Like' temperature using a complex heat index and wind chill algorithm, ensuring you understand the true environmental impact on your comfort. This calculation takes into account not just the ambient air temperature, but also the relative humidity and wind speed—factors that can drastically change how the body perceives heat or cold. Furthermore, our Air Quality Index (AQI) tracking provides granular details on particulates like PM2.5 and PM10, as well as gaseous pollutants, making us a vital tool for health-conscious users in urban environments. The results are delivered through an optimized architecture that prioritizes speed and smoothness, even on low-bandwidth connections.`;

const SCIENCE_TEXT = `Understanding the atmosphere requires a deep dive into the physics of fluid dynamics and thermodynamics. Weather is essentially the movement of energy across the globe, driven by the temperature differential between the equator and the poles. At AeroWeather, we visualize these energy flows through our interactive radar and wind maps. We monitor barometric pressure systems—the invisible 'mountains' and 'valleys' of the air—to predict shifts in weather patterns days before they arrive.

Humidity plays a crucial role in this system. It isn't just about how 'sticky' the air feels; it's about the latent energy stored in water vapor. High humidity can fuel intense thunderstorms and even influence the track of major hurricanes. By providing detailed dew point data and saturation levels, AeroWeather gives you a deeper look into the atmospheric fuel that drives your local weather. We also track the UV Index, a critical measure of solar radiation that helps you protect your long-term skin health. Our educational approach ensures that you aren't just reacting to the weather, but understanding the science behind it.`;

const SUSTAINABLE_TEXT = `As we face an era of increasing climate variability, the need for accurate and accessible environmental data has never been greater. AeroWeather is committed to providing a sustainable intelligence platform that minimizes its own digital footprint while maximizing user awareness. Our lightweight data protocols mean faster loading times with less energy consumption, and our focus on long-term climate trends helps users understand the broader shifts in their local environment.

We believe that transparency is the foundation of trust. That's why our data sourcing is open and verifiable. We use elite scientific APIs like Open-Meteo, which are recognized for their accuracy and lack of commercial bias. By focusing on pure meteorological data and a minimal, non-intrusive advertising approach, we maintain a clean, high-performance environment that respects your time and your digital bandwidth. AeroWeather is more than a tool; it's a partner in your environmental awareness, helping you adapt to a changing world with precision and grace.`;

export function HomeContent() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 md:py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <LongTextBlock 
          title="The Future of Weather Intelligence" 
          content={INTRO_TEXT} 
        />
        <LongTextBlock 
          title="Science and Technology Behind the Scenes" 
          content={TECH_TEXT} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <LongTextBlock 
          title="The Atmospheric Science Advantage" 
          content={SCIENCE_TEXT} 
        />
        <LongTextBlock 
          title="Sustainable and Transparent Data" 
          content={SUSTAINABLE_TEXT} 
        />
      </div>
      
      <GlassCard className="rounded-2xl p-8 md:p-16 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl text-white">Why Choose AeroWeather?</h2>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/70">
          We combine the accuracy of professional-grade scientific models with the beauty of modern system design. A privacy-first experience with a Clean & Minimal Experience—just the precision intelligence you need to stay ahead of the weather every single day.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <GlassCard className="px-6 py-4 text-white">
            <span className="block text-2xl font-bold">15min</span>
            <span className="text-xs text-white/40 uppercase tracking-widest">Update Frequency</span>
          </GlassCard>
          <GlassCard className="px-6 py-4 text-white">
            <span className="block text-2xl font-bold">50k+</span>
            <span className="text-xs text-white/40 uppercase tracking-widest">Cities Tracked</span>
          </GlassCard>
          <GlassCard className="px-6 py-4 text-white">
            <span className="block text-2xl font-bold">High-Performance</span>
            <span className="text-xs text-white/40 uppercase tracking-widest">Data Delivery</span>
          </GlassCard>
        </div>
      </GlassCard>

      <FaqSection />
    </section>
  );
}
