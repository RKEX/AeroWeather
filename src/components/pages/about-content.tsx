"use client";

import { Link } from "@/navigation";
import { 
  Activity, 
  Compass, 
  Database, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Heart, 
  Plane, 
  Wind, 
  Mail,
  User,
  ArrowRight
} from "lucide-react";

export default function AboutContent() {
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      {/* Navigation Back */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 hover:bg-white/10 transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
          About AeroWeather
        </h1>
        <p className="text-xl text-indigo-200/80 mb-8 font-medium">
          Redefining the Human-Atmospheric Connection
        </p>
        <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-8"></div>
        <p className={`${textSecondary} text-lg leading-relaxed max-w-3xl mx-auto`}>
          Weather isn&apos;t just something that happens outside your window; it is a fundamental force that shapes how you feel, how you work, and how you connect with others. AeroWeather is the world&apos;s first AI-powered weather intelligence platform designed to bridge the gap between atmospheric science and human behavior.
        </p>
      </section>

      {/* The Problem Section */}
      <section className="mb-20">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Beyond the Traditional Forecast
          </h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              Traditional weather apps tell you if you need an umbrella, but they don&apos;t tell you if you need to adjust your expectations for the day. A 72°F day in high humidity feels vastly different than the same temperature in a dry climate. A sudden drop in pressure doesn&apos;t just mean rain—for many, it means a migraine or a dip in focus.
            </p>
            <p>
              Most apps treat humans as passive observers. We treat you as a biological being in constant dialogue with your environment. Neglecting the profound <span className="text-indigo-300 font-semibold italic">weather impact on mood</span> and physical health is a missed opportunity for optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">Our Mission & Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <Compass className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">The Mission</h3>
            <p className="text-white/60 leading-relaxed">
              To empower individuals to reclaim control over their daily lives by understanding the invisible threads connecting the atmosphere to their biology and psychology. We turn weather from an unpredictable hurdle into a strategic advantage.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <Eye className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">The Vision</h3>
            <p className="text-white/60 leading-relaxed">
              A world where every person is in sync with their environment. We envision a future where your home, your schedule, and your habits automatically adapt to the atmospheric state to maintain your peak wellbeing.
            </p>
          </div>
        </div>
      </section>

      {/* The Human Impact Layer */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">The Human Impact Layer</h2>
          <p className="text-white/50">Beyond Traditional Forecasting</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/impact" className="group block p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all">
            <Calendar className="w-8 h-8 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Impact Calendar</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              A 30-day human impact planning tool. Stop guessing why you feel &quot;off&quot; and start aligning your high-focus tasks with favorable atmospheric conditions.
            </p>
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-400">
              Explore Impact <ArrowRight className="ml-2 w-3 h-3" />
            </span>
          </Link>

          <Link href="/love" className="group block p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/50 transition-all">
            <Heart className="w-8 h-8 text-pink-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">Love & Dating Insights</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Understanding <span className="italic">weather and relationships</span>. Discover how social compatibility shifts with the barometer and choose the perfect windows for connection.
            </p>
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-pink-400">
              Explore Love <ArrowRight className="ml-2 w-3 h-3" />
            </span>
          </Link>

          <Link href="/travel" className="group block p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all">
            <Plane className="w-8 h-8 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Travel Intelligence</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Go beyond &quot;packing a jacket.&quot; Analyze the acclimation period your body needs based on humidity, altitude, and air quality shifts at your destination.
            </p>
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-400">
              Explore Travel <ArrowRight className="ml-2 w-3 h-3" />
            </span>
          </Link>

          <Link href="/meditation" className="group block p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all">
            <Wind className="w-8 h-8 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Meditation & Mood Sync</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Master the <span className="italic text-emerald-200/70">weather impact on mood</span>. Guided mindfulness protocols tailored to the current atmospheric state and ionization levels.
            </p>
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-400">
              Explore Mood <ArrowRight className="ml-2 w-3 h-3" />
            </span>
          </Link>
        </div>
      </section>

      {/* Technology Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">The Engine: Precision Meets Prediction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-6 h-6 text-indigo-400 mb-4" />
            <h4 className="text-white font-bold mb-2">AI Insights</h4>
            <p className="text-white/50 text-xs leading-relaxed">
              Proprietary <span className="text-indigo-300">AI weather insights</span> trained on decades of biometeorological data.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <Activity className="w-6 h-6 text-indigo-400 mb-4" />
            <h4 className="text-white font-bold mb-2">Real-time Radar</h4>
            <p className="text-white/50 text-xs leading-relaxed">
              Hyper-local telemetry with 99.9% accuracy for atmospheric shifts.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <Database className="w-6 h-6 text-indigo-400 mb-4" />
            <h4 className="text-white font-bold mb-2">Data Sourcing</h4>
            <p className="text-white/50 text-xs leading-relaxed">
              Aggregated feeds from NOAA, ECMWF, and global IoT sensor networks.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-6 h-6 text-indigo-400 mb-4" />
            <h4 className="text-white font-bold mb-2">Privacy First</h4>
            <p className="text-white/50 text-xs leading-relaxed">
              End-to-end encryption for all biometric and behavioral sync data.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="mb-20">
        <div className="p-8 md:p-12 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Founder & Vision</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto italic">
            &quot;We plan our finances, our diets, and our careers, but we leave our daily wellbeing to the whims of the weather. AeroWeather was built to give people that missing piece of the puzzle.&quot;
          </p>
          <p className="text-indigo-300 font-bold mb-8">— Rick Das, Founder</p>
          <Link
            href="/rick-das"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
          >
            Read the Founder Story
          </Link>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">Who We Are</h2>
            </div>
            <p className="text-white/60 leading-relaxed mb-6">
              Behind the algorithms, we are a small team of data scientists, meteorologists, and wellness advocates. We are people who feel the &quot;Monday morning blues&quot; when the barometer drops and the sky turns grey. We built AeroWeather because we needed it ourselves—a tool that treats us like biological beings, not just coordinates on a map.
            </p>
            <p className="text-white/60 leading-relaxed">
              We believe in transparency, authenticity, and the power of technology to improve the human condition without losing our connection to the natural world.
            </p>
          </div>
          <div className="w-full md:w-64 aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-20 h-20 text-indigo-500/20" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-20 text-center">
        <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
          <Mail className="w-10 h-10 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            Whether you are a researcher interested in biometeorology or a user with feedback for our <Link href="/impact" className="text-indigo-400 hover:underline font-medium">Impact Calendar</Link>, we&apos;d love to hear from you.
          </p>
          <a
            href="mailto:support@aeroweather.app"
            className="text-lg md:text-xl font-bold text-white hover:text-indigo-300 transition-colors"
          >
            support@aeroweather.app
          </a>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="border-t border-white/10 pt-12 text-center">
        <p className="text-white/30 text-xs leading-relaxed max-w-2xl mx-auto italic">
          Disclaimer: AeroWeather provides insights based on environmental data and AI modeling. We are not medical professionals. The information provided regarding mood, health triggers, and physical performance is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </section>
    </main>
  );
}
