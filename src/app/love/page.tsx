import { Metadata } from "next";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Calendar, 
  Plane,
  Activity,
  Users,
  Flame,
  Moon
} from "lucide-react";

export const metadata: Metadata = {
  title: "Weather & Relationships – The Science of Atmospheric Connection",
  description: "Discover how weather impacts human relationships, social friction, and emotional bonding. Use AeroWeather's Love & Dating intelligence to sync your connection with the sky.",
};

export default function LovePage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-pink-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Heart className="w-3 h-3" /> Emotional Atmospheric Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Weather & Relationships: The Science of <span className="text-pink-400">Atmospheric Connection</span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
            Understand how barometric shifts and thermal energy dictate the rhythm of human connection. Sync your social life with the atmosphere.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dating-weather/london" 
              className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-pink-600/20 flex items-center gap-2"
            >
              Get Your Love Forecast <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all"
            >
              The Science of Sync
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
        </div>
      </section>

      {/* Feature Navigation */}
      <nav className="max-w-4xl mx-auto px-4 mb-20">
        <div className="flex flex-wrap justify-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Link href="/impact" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Impact</Link>
          <Link href="/love" className="px-6 py-2 rounded-xl bg-pink-500 text-white text-sm font-bold shadow-lg">Love & Dating</Link>
          <Link href="/travel" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Travel</Link>
          <Link href="/meditation" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Meditation</Link>
        </div>
      </nav>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 pb-32">
        <div className="prose prose-invert max-w-none">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 not-prose">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-colors">
              <Users className="w-10 h-10 text-pink-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Social Friction</h3>
              <p className="text-sm text-white/60 leading-relaxed">Predicting days where atmospheric heat and pressure might lead to shorter fuses and increased conflict.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
              <Moon className="w-10 h-10 text-purple-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Nesting Behavior</h3>
              <p className="text-sm text-white/60 leading-relaxed">Identifying low-pressure windows that encourage deep emotional bonding and domestic comfort.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors">
              <Flame className="w-10 h-10 text-orange-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Romantic Vitality</h3>
              <p className="text-sm text-white/60 leading-relaxed">The connection between sunlight, ionization, and the energy needed for high-stakes social events.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-white">Understanding Weather and Relationships</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            Human emotions do not exist in a vacuum. We are biological organisms deeply influenced by our environment. The concept of **weather and relationships** is a growing field in environmental psychology, exploring how everything from temperature to wind speed affects our patience, our attraction, and our ability to empathize.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            AeroWeather&apos;s Love & Dating intelligence uses these insights to help you navigate your social life with a &quot;birds-eye view&quot; of the atmospheric state. We help you choose the right days for a first date, a difficult conversation, or a cozy evening in.
          </p>

          <h2 className="text-3xl font-bold mb-8 text-white">Heat, Humidity, and Social Friction</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            It is well-documented that extreme heat is statistically correlated with increased social friction and irritability. When the body is under thermal stress, the brain&apos;s ability to regulate impulsive emotional responses decreases. This is often why &quot;arguments out of nowhere&quot; happen during peak summer afternoons.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            By identifying these high-friction windows, AeroWeather allows you to practice &quot;Atmospheric Awareness.&quot; Knowing that a heatwave is making everyone a little more on-edge can give you the extra perspective needed to choose patience over conflict.
          </p>

          <div className="p-10 rounded-3xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 mb-16 not-prose">
            <h3 className="text-2xl font-bold mb-4 text-white">Nesting vs. Exploring: The Barometric Rhythm</h3>
            <p className="text-white/70 leading-relaxed">
              When the barometer drops and the sky turns grey, our biology often shifts into &quot;Nesting Mode.&quot; This is characterized by a desire for security, warmth, and close emotional connection. Conversely, high-pressure, sunny days trigger &quot;Exploration Mode,&quot; where we are more open to new people and high-energy social environments. Our algorithm helps you identify which mode the sky is encouraging.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-10 text-white text-center">Love Intelligence Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-20">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Compatibility Forecast</h4>
                <p className="text-sm text-white/60 leading-relaxed">Daily ratings for social harmony based on predicted atmospheric stressors.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Date Night Optimizer</h4>
                <p className="text-sm text-white/60 leading-relaxed">Identify the perfect windows for outdoor romantic events or cozy indoor connections.</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-white/5 border border-white/10 p-12 rounded-[2.5rem] not-prose">
            <h2 className="text-3xl font-bold text-white mb-6">Master Your Social Atmosphere</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Choose your city to see how the current sky is influencing the relationships in your area.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dating-weather/new-york" 
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all"
              >
                New York Love Forecast
              </Link>
              <Link 
                href="/dating-weather/paris" 
                className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
              >
                Paris Love Forecast
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
          <Link href="/travel" className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Plane className="w-6 h-6 text-blue-400" />
            <div>
              <h5 className="font-bold text-white">Travel Intelligence</h5>
              <p className="text-xs text-white/40 group-hover:text-blue-300/60 transition-colors">Beyond the Forecast</p>
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
