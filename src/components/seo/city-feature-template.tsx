import GlassCard from "@/components/ui/GlassCard";
import { Link } from "@/navigation";
import { WeatherData } from "@/types/weather";
import { Brain, CloudRain, Heart, MapPin, Sun, Wind, Zap } from "lucide-react";
import type { Route } from "next";
import React from "react";

interface CityFeatureTemplateProps {
  city: string;
  feature: "impact" | "love" | "travel" | "meditation";
  weatherData: WeatherData;
  content: {
    h1: string;
    intro: string;
    sections: {
      title: string;
      body: string;
      icon: React.ReactNode;
    }[];
    tips: string[];
  };
}

export function CityFeatureTemplate({ city, feature, weatherData, content }: CityFeatureTemplateProps) {
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  
  return (
    <div className="relative min-h-screen bg-transparent pt-12 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <nav className="mb-12 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/30">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="h-1 w-1 rounded-full bg-white/10" />
          <Link href={`/${feature}`} className="hover:text-white transition-colors">{feature}</Link>
          <span className="h-1 w-1 rounded-full bg-white/10" />
          <span className="text-white/60">{cityName}</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-20">
          <h1 className="mb-8 text-4xl font-black text-white md:text-6xl lg:text-8xl leading-[1] tracking-tighter max-w-4xl">
            {content.h1}
          </h1>
          <p className="text-xl md:text-2xl text-white/50 font-medium max-w-3xl leading-[1.6]">
            {content.intro}
          </p>
        </header>

        {/* Weather Snapshot Grid */}
        <div className="grid gap-6 md:grid-cols-4 mb-24">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <Sun className="h-8 w-8 text-amber-400 mb-4" />
            <div className="text-3xl font-black text-white">{weatherData?.current?.temperature2m ?? "--"}°C</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">Surface Temp</div>
          </GlassCard>
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <Wind className="h-8 w-8 text-cyan-400 mb-4" />
            <div className="text-3xl font-black text-white">{weatherData?.current?.windSpeed10m ?? "--"} km/h</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">Atmospheric Flow</div>
          </GlassCard>
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <CloudRain className="h-8 w-8 text-blue-400 mb-4" />
            <div className="text-3xl font-black text-white">{weatherData?.current?.relativeHumidity2m ?? "--"}%</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">Moisture Load</div>
          </GlassCard>
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <Zap className="h-8 w-8 text-purple-400 mb-4" />
            <div className="text-3xl font-black text-white">{weatherData?.airQuality?.usAqi ?? "--"}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">Impact Index</div>
          </GlassCard>
        </div>

        {/* Main SEO Content Body */}
        <div className="grid gap-16 lg:grid-cols-3 mb-32">
          <div className="lg:col-span-2 space-y-20">
            {content.sections.map((section, idx) => (
              <section key={idx} className="group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/60 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div 
                  className="prose prose-invert max-w-none prose-p:text-xl md:prose-p:text-2xl prose-p:text-white/60 prose-p:leading-[1.8] prose-p:font-medium"
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              </section>
            ))}
          </div>

          {/* Sidebar / Tips */}
          <aside className="space-y-12">
            <GlassCard className="p-8 border-white/20 bg-white/5">
              <h3 className="text-xl font-black text-white mb-8 tracking-tight uppercase">Atmospheric Tips</h3>
              <ul className="space-y-6">
                {content.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4 text-white/60 font-medium text-lg leading-relaxed">
                    <span className="h-2 w-2 mt-3 shrink-0 rounded-full bg-white/20" />
                    {tip}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-8 bg-gradient-to-br from-indigo-500/20 to-transparent">
              <h3 className="text-xl font-black text-white mb-4 tracking-tight">Local Connection</h3>
              <p className="text-white/40 mb-8 font-medium">Explore the full weather profile for this location.</p>
              <Link 
                href={`/weather/${city}`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-black uppercase tracking-widest text-slate-900 hover:bg-white/90 transition-all"
              >
                Full {cityName} Dashboard
              </Link>
            </GlassCard>
          </aside>
        </div>

        {/* Cross-Linking Footer */}
        <section className="mb-32 border-t border-white/10 pt-20">
          <h2 className="text-2xl font-black text-white tracking-tight mb-12 uppercase opacity-40">Internal Insight Network</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { name: "Impact", href: "/impact", icon: <Zap className="h-5 w-5" /> },
              { name: "Love", href: "/love", icon: <Heart className="h-5 w-5" /> },
              { name: "Travel", href: "/travel", icon: <MapPin className="h-5 w-5" /> },
              { name: "Meditation", href: "/meditation", icon: <Brain className="h-5 w-5" /> },
            ].map((link) => (
              <GlassCard 
                key={link.name} 
                as="div"
                className="group p-6 hover:bg-white/10 transition-all duration-500"
              >
                <Link href={`${link.href}/${city}` as Route} className="flex items-center gap-4">
                  <div className="text-white/40 group-hover:text-white transition-colors">{link.icon}</div>
                  <span className="text-lg font-black text-white/60 group-hover:text-white transition-colors">
                    {link.name}
                  </span>
                </Link>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
