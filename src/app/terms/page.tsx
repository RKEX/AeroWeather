import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { Scale, ShieldCheck, AlertTriangle, FileText, Mail, LucideIcon } from "lucide-react";

export default function TermsPage() {
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/15"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Service</h1>
        <p className={`${textSecondary} text-lg`}>
          Guidelines for using the AeroWeather intelligence platform.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <TermsSection 
          icon={FileText} 
          title="Introduction" 
          content="By using AeroWeather you agree to these legal terms. Please read them carefully before utilizing our forecasts, radar, or AI-powered services." 
        />
        <TermsSection 
          icon={ShieldCheck} 
          title="Weather Data Disclaimer" 
          content="Weather information is provided for informational purposes only. We strive for accuracy through elite providers, but meteorology is inherently probabilistic." 
        />
        <TermsSection 
          icon={AlertTriangle} 
          title="No Liability" 
          content="The creator of AeroWeather is not responsible for decisions made based on weather data provided by the platform. Please use multiple sources for critical safety decisions." 
        />
        <TermsSection 
          icon={Scale} 
          title="Platform Usage" 
          content="Users may use the website freely but may not copy, reverse-engineer, or misuse the platform architecture. All intellectual property belongs to the creator." 
        />
        
        <GlassCard className="p-8 text-center mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Need clarification on these terms?</h2>
          <p className={`${textSecondary} mb-6`}>
            We&apos;re happy to explain our terms of service and how they affect your user experience.
          </p>
          <a 
            href="mailto:rickd7587@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 border border-indigo-400/30 text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            <Mail className="w-5 h-5" />
            Contact us
          </a>
        </GlassCard>
      </div>
    </main>
  );
}

function TermsSection({ icon: Icon, title, content }: { icon: LucideIcon, title: string, content: string }) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex gap-6">
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/60 leading-relaxed">{content}</p>
        </div>
      </div>
    </GlassCard>
  );
}
