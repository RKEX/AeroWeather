import { Metadata } from "next";
import Link from "next/link";
import { 
  Calendar, 
  Brain, 
  Zap, 
  Heart, 
  ArrowRight, 
  Wind, 
  Sun, 
  CloudRain,
  Activity,
  Compass,
  Plane,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Weather Impact Calendar – Plan Your Life with Weather Intelligence",
  description: "Understand how weather impacts your mood, health, and productivity with AeroWeather's Impact Calendar. Advanced weather-based planning for the modern lifestyle.",
};

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" /> AI-Powered Atmospheric Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Weather Impact Calendar – Plan Your Life with <span className="text-indigo-400">Atmospheric Intelligence</span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
            Go beyond the forecast. Discover how atmospheric shifts influence your cognitive performance, emotional resilience, and physical wellbeing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/weather/new-york" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
            >
              Check Your Local Impact <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all"
            >
              Learn the Science
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
        </div>
      </section>

      {/* Feature Navigation */}
      <nav className="max-w-4xl mx-auto px-4 mb-20">
        <div className="flex flex-wrap justify-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Link href="/impact" className="px-6 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold shadow-lg">Impact</Link>
          <Link href="/love" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Love & Dating</Link>
          <Link href="/travel" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Travel</Link>
          <Link href="/meditation" className="px-6 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white text-sm font-medium transition-all">Meditation</Link>
        </div>
      </nav>

      {/* Long Form Content Section */}
      <section className="max-w-4xl mx-auto px-4 pb-32">
        <div className="prose prose-invert max-w-none">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 not-prose">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors">
              <Brain className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Cognitive Focus</h3>
              <p className="text-sm text-white/60 leading-relaxed">How pressure and humidity affect your brain&apos;s ability to handle complex tasks.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
              <Zap className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Physical Energy</h3>
              <p className="text-sm text-white/60 leading-relaxed">Understanding the thermal energy levels your body needs to maintain high activity.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-colors">
              <Heart className="w-10 h-10 text-pink-400 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Emotional Grit</h3>
              <p className="text-sm text-white/60 leading-relaxed">The connection between ionization, sunlight, and your daily emotional resilience.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-white">What is the Weather Impact Calendar?</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            The **Impact Calendar** is a revolutionary approach to personal productivity and health management. While traditional weather apps tell you to carry an umbrella, AeroWeather tells you when to schedule your most important work. By analyzing 30-day atmospheric trends through the lens of biometeorology, we provide a predictive roadmap for your internal state.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            Our proprietary algorithm translates complex data—like barometric pressure shifts, dew points, and solar radiation levels—into actionable human metrics. It is the bridge between the world outside and your performance inside.
          </p>

          <h2 className="text-3xl font-bold mb-8 text-white">The Science: Weather Impact on Mood and Brain Function</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            It is a scientifically documented fact that the **weather impact on mood** is profound. Research into biometeorology shows that positive ions, often found in the air before a storm, can increase levels of serotonin in some individuals while causing anxiety and irritability in others. Similarly, low barometric pressure is frequently linked to a decrease in cognitive focus and a higher incidence of physical discomfort, such as joint pain or migraines.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            By acknowledging these environmental variables, you move from a state of reactive frustration to one of proactive intelligence. The Impact Calendar identifies these &quot;Cognitive Dips&quot; and &quot;Performance Peaks&quot; weeks in advance, allowing you to master your schedule rather than being a victim of the atmosphere.
          </p>

          <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 mb-16 not-prose">
            <h3 className="text-2xl font-bold mb-4 text-white">Productivity vs. Weather: Finding Your Flow</h3>
            <p className="text-white/70 leading-relaxed">
              Why do some days feel like you&apos;re running through sand, even after eight hours of sleep? Often, the answer is in the air. High humidity combined with specific thermal levels can lead to a phenomenon known as &quot;Atmospheric Fatigue,&quot; where the body works harder just to maintain its internal temperature, leaving less energy for the brain. Our system helps you identify &quot;Deep Work Windows&quot;—those rare intersections of high pressure and optimal light where human creativity peaks.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-white">The Importance of Weather-Based Planning</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            In our modern, high-performance world, we optimize everything—our diets, our sleep cycles, and our workouts. Yet, we often ignore the largest environmental variable: the weather. **Weather-based planning** is the final frontier of bio-hacking. It is the practice of aligning your high-stakes life events with the days your biology is most likely to support them.
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-12">
            Whether you are planning a product launch, a wedding, or a major physical challenge, understanding the long-range impact of the atmosphere gives you a competitive edge that others lack. It is about minimizing friction and maximizing flow.
          </p>

          <h2 className="text-3xl font-bold mb-10 text-white text-center">Core Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-20">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Work & Career</h4>
                <p className="text-sm text-white/60 leading-relaxed">Schedule your most difficult meetings and creative sessions during high-focus atmospheric windows.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Health & Fitness</h4>
                <p className="text-sm text-white/60 leading-relaxed">Predict and mitigate migraine triggers or joint pain days before they happen. Optimize your training intensity.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Social & Relationships</h4>
                <p className="text-sm text-white/60 leading-relaxed">Understand when the atmosphere is likely to cause social friction and choose the best days for connection.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Travel & Adventure</h4>
                <p className="text-sm text-white/60 leading-relaxed">Build itineraries that respect your body&apos;s need for climate acclimation, ensuring you arrive ready to explore.</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-white/5 border border-white/10 p-12 rounded-[2.5rem] not-prose">
            <h2 className="text-3xl font-bold text-white mb-6">Start Planning Your Life with Intelligence</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Join thousands of users who are reclaiming their time and energy by staying in sync with the atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/weather/london" 
                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all"
              >
                View London Impact
              </Link>
              <Link 
                href="/weather/mumbai" 
                className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
              >
                View Mumbai Impact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Internal Feature Footer */}
      <footer className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 border-t border-white/10">
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
