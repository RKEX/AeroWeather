import { GlassCard } from "@/components/ui/glass-card";
import { constructMetadata, metadataConfig } from "@/config/metadata";
import { Database, LucideIcon, Mail, MapPin, Share2, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: metadataConfig.privacy.title,
  description: metadataConfig.privacy.description,
});

export default function PrivacyPage() {
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/15"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className={`${textSecondary} text-lg`}>
          Transparent data practices for the AeroWeather intelligence platform.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <PrivacySection 
          icon={Shield} 
          title="Introduction" 
          content="AeroWeather respects user privacy and does not collect unnecessary personal data. Our goal is to provide accurate weather forecasts without compromising your digital security." 
        />
        <PrivacySection 
          icon={MapPin} 
          title="Location Data" 
          content="If location permission is granted, the website may use your device's geographical location solely to show local weather forecasts. This data is processed in real-time and not used for tracking." 
        />
        <PrivacySection 
          icon={Database} 
          title="Data Storage" 
          content="Personal user data is not permanently stored. We prioritize on-device processing and state persistence via local browser storage for your convenience." 
        />
        <PrivacySection 
          icon={Share2} 
          title="Third Party APIs" 
          content="Weather data is provided by external services such as Open-Meteo APIs. While we fetch data from these sources, your personal identity is not shared with these providers." 
        />
        
        <GlassCard className="p-8 text-center mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Questions about your privacy?</h2>
          <p className={`${textSecondary} mb-6`}>
            If you have any questions or concerns regarding our privacy practices, please contact us directly.
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

function PrivacySection({ icon: Icon, title, content }: { icon: LucideIcon, title: string, content: string }) {
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
