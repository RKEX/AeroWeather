import {
    ArrowRight,
    Calendar,
    Cloud,
    Droplets,
    Heart,
    Moon,
    Plane,
    Sparkles,
    Wind
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meditation & Mood Sync – Find Your Atmospheric Flow",
  description: "Master the weather impact on mood with AeroWeather's Meditation Sync. Guided mindfulness protocols tailored to current atmospheric conditions and ionization.",
};

export default function MeditationPage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Wind className="w-3 h-3" /> Spiritual Atmospheric Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Meditation & Mood Sync: Find Your <span className="text-emerald-400">Atmospheric Flow</span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
            Stop fighting the weather. Use the natural energy of the sky to deepen your mindfulness and master your emotional state.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/meditation/london" 
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
            >
              Get Your Mood Forecast <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all"
            >
              The Science of Mood
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>
      </section>

      {/* Feature Navigation */}
      <nav className="max-w-4xl mx-auto px-4 mb-20">
        <div className="flex flex-wrap justify-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Link href="/impact" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Impact</Link>
          <Link href="/love" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Love & Dating</Link>
          <Link href="/travel" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Travel</Link>
          <Link href="/meditation" className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-lg">Meditation</Link>
        </div>
      </nav>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 pb-32">
        <div className="prose prose-invert max-w-none">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 not-prose">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
              <Droplets className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Emotional Humidity</h3>
              <p className="text-sm text-white/60 leading-relaxed">Understanding how atmospheric moisture levels influence your feelings of &quot;heaviness&quot; or &quot;clarity.&quot;</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
              <Cloud className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Luminous Presence</h3>
              <p className="text-sm text-white/60 leading-relaxed">Syncing your meditation with solar intensity and cloud coverage for optimal serotonin regulation.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
              <Wind className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Pressure Flow</h3>
              <p className="text-sm text-white/60 leading-relaxed">Using barometric shifts as a guide for breathing techniques and stillness practice.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-white">The Science: Weather Impact on Mood</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            Biometeorology research has proven that our internal emotional state is in constant dialogue with the atmosphere. The **weather impact on mood** is not just about &quot;rainy day blues.&quot; It is a complex interaction between light levels, air ionization, and pressure systems. AeroWeather&apos;s Meditation Sync module helps you identify these shifts before they happen.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            Instead of fighting the natural lethargy of an overcast day or the manic energy of a pre-storm pressure drop, we help you lean into it. Our mindfulness protocols are built to work *with* the sky, not against it.
          </p>

          <h2 className="text-3xl font-bold mb-8 text-white">Meditation and Weather: Finding Balance</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            On a high-pressure, bright day, your nervous system is naturally more alert. This is the perfect time for &quot;Expansive Focus&quot; meditations. Conversely, during low-pressure, heavy sky events, the body naturally wants to conserve energy—a perfect window for &quot;Inner Sanctuary&quot; or deep restorative practices.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            By following our Atmospheric Flow guide, you ensure that your mindfulness practice is always supported by the environment around you. It is the ultimate form of living in harmony with nature.
          </p>

          <div className="p-10 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 mb-16 not-prose">
            <h3 className="text-2xl font-bold mb-4 text-white">Ionization & Emotional Resilience</h3>
            <p className="text-white/70 leading-relaxed">
              Air ionization shifts dramatically during weather events, particularly storms and high-wind periods. These invisible charges have a documented effect on human anxiety and focus levels. Our system tracks these shifts, alerting you when you might need a grounding practice to maintain your center.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-10 text-white text-center">Meditation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-20">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Moon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Atmospheric Flow Guide</h4>
                <p className="text-sm text-white/60 leading-relaxed">Daily mindfulness recommendations based on the sky&apos;s energy state.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Mood Sync Alerts</h4>
                <p className="text-sm text-white/60 leading-relaxed">Identify when environmental stressors are likely to impact your emotional resilience.</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-white/5 border border-white/10 p-12 rounded-[2.5rem] not-prose">
            <h2 className="text-3xl font-bold text-white mb-6">Find Your Center in Any Sky</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Choose your city to see how the current atmosphere is influencing the mental flow in your region.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/meditation/new-york" 
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all"
              >
                New York Mood Sync
              </Link>
              <Link 
                href="/meditation/kyoto" 
                className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
              >
                Kyoto Mood Sync
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
          <Link href="/travel" className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Plane className="w-6 h-6 text-blue-400" />
            <div>
              <h5 className="font-bold text-white">Travel Intelligence</h5>
              <p className="text-xs text-white/40 group-hover:text-blue-300/60 transition-colors">Beyond the Forecast</p>
            </div>
          </Link>
        </div>
      </footer>
    </main>
  );
}
