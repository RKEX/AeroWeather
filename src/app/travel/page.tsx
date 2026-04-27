import { Metadata } from "next";
import Link from "next/link";
import { 
  Plane, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Map, 
  Wind, 
  Thermometer, 
  CloudRain, 
  Activity, 
  Calendar, 
  Heart,
  Globe
} from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Weather Intelligence – Beyond the Forecast",
  description: "Plan your next journey with AeroWeather's Travel Intelligence. Analyze climate acclimation, humidity shifts, and atmospheric comfort at your destination.",
};

export default function TravelPage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Plane className="w-3 h-3" /> Global Atmospheric Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Travel Intelligence: Plan Beyond the <span className="text-blue-400">Forecast</span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
            AeroWeather doesn&apos;t just tell you what to pack. We tell you how your body will feel when you arrive.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/weather/tokyo" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
            >
              Explore Your Destination <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all"
            >
              How it Works
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px]" />
        </div>
      </section>

      {/* Feature Navigation */}
      <nav className="max-w-4xl mx-auto px-4 mb-20">
        <div className="flex flex-wrap justify-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Link href="/impact" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Impact</Link>
          <Link href="/love" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Love & Dating</Link>
          <Link href="/travel" className="px-6 py-2 rounded-xl bg-blue-500 text-white text-sm font-bold shadow-lg">Travel</Link>
          <Link href="/meditation" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Meditation</Link>
        </div>
      </nav>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 pb-32">
        <div className="prose prose-invert max-w-none">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 not-prose">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
              <Globe className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Climate Acclimation</h3>
              <p className="text-sm text-white/60 leading-relaxed">Calculating the physiological shift your body will experience when moving between diverse climates.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors">
              <Activity className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Bio-Suitability</h3>
              <p className="text-sm text-white/60 leading-relaxed">Understanding how destination air quality and humidity will affect your specific energy levels.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
              <Map className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Itinerary Intelligence</h3>
              <p className="text-sm text-white/60 leading-relaxed">Aligning your activities with the local atmospheric flow to minimize travel fatigue.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-white">What is Travel Weather Intelligence?</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            Most travel apps provide a generic 7-day forecast. **Travel Weather Intelligence** is about the relationship between your destination&apos;s atmosphere and your biological baseline. When you travel from a dry, cold climate to a humid, tropical one, your body undergoes a massive physiological shift. AeroWeather helps you predict and manage this acclimation process.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            By analyzing the delta between your home environment and your destination, we provide a &quot;Biological Sync Roadmap,&quot; ensuring you don&apos;t spend the first three days of your trip feeling sluggish or dehydrated.
          </p>

          <h2 className="text-3xl font-bold mb-8 text-white">Climate Acclimation: The Science of Arrival</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            The body takes time to adjust to new levels of humidity, atmospheric pressure, and solar intensity. This acclimation period is often what people mistake for simple &quot;jet lag.&quot; AeroWeather&apos;s Travel module analyzes your destination&apos;s UV index and dew point to suggest hydration and exposure protocols that speed up this process.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            Whether you are heading to the high-altitude peaks of the Andes or the urban humidity of Southeast Asia, our intelligence ensures your itinerary respects your body&apos;s physical limits during the transition period.
          </p>

          <div className="p-10 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 mb-16 not-prose">
            <h3 className="text-2xl font-bold mb-4 text-white">Air Quality & Travel Health</h3>
            <p className="text-white/70 leading-relaxed">
              Air quality is a critical variable in travel comfort, especially for sensitive groups. We provide long-range AQI trends for major global cities, allowing you to choose the best windows for outdoor exploration or identifying when you should prioritize indoor cultural experiences.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-10 text-white text-center">Travel Feature Suite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-20">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Compass className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Acclimation Roadmap</h4>
                <p className="text-sm text-white/60 leading-relaxed">Daily advice on how to adjust your body to the local humidity and pressure shifts.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Wind className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">AQI Travel Alerts</h4>
                <p className="text-sm text-white/60 leading-relaxed">Stay informed about local pollution spikes that could impact your sightseeing plans.</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-white/5 border border-white/10 p-12 rounded-[2.5rem] not-prose">
            <h2 className="text-3xl font-bold text-white mb-6">Explore the World with Intelligence</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Select a destination to see how the atmosphere will influence your next adventure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/weather/london" 
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all"
              >
                London Intelligence
              </Link>
              <Link 
                href="/weather/dubai" 
                className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
              >
                Dubai Intelligence
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Feature Footer */}
      <footer className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 border-t border-white/10">
          <Link href="/impact" className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <div>
              <h5 className="font-bold text-white">Impact Calendar</h5>
              <p className="text-xs text-white/40 group-hover:text-indigo-300/60 transition-colors">Plan Your Life</p>
            </div>
          </Link>
          <Link href="/love" className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Heart className="w-6 h-6 text-pink-400" />
            <div>
              <h5 className="font-bold text-white">Love & Dating</h5>
              <p className="text-xs text-white/40 group-hover:text-pink-300/60 transition-colors">Weather & Relationships</p>
            </div>
          </Link>
          <Link href="/meditation" className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Wind className="w-6 h-6 text-emerald-400" />
            <div>
              <h5 className="font-bold text-white">Mood & Meditation</h5>
              <p className="text-xs text-white/40 group-hover:text-emerald-300/60 transition-colors">Atmospheric Flow</p>
            </div>
          </Link>
        </div>
      </footer>
    </main>
  );
}
