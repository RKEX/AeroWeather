"use client";

import type { LucideIcon } from "lucide-react";
import { Cloud, Compass, Eye, FileText, Rocket } from "lucide-react";
import Link from "next/link";

export default function AboutContent() {
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
        >
          Back
        </Link>
      </div>

      <section className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          About AeroWeather
        </h1>
        <p className={`${textSecondary} text-sm leading-relaxed max-w-2xl mx-auto`}>
          AeroWeather is a modern weather intelligence platform designed to deliver
          real-time forecasts, hourly predictions, 7-day outlooks, AQI visibility,
          and radar-based insights with a performance-first, user-friendly experience.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          Mission & Vision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={Compass}
            title="Mission"
            desc="Make high-quality, real-time weather intelligence accessible to everyone with speed, clarity, and trust."
          />
          <InfoCard
            icon={Eye}
            title="Vision"
            desc="Build a next-generation weather product ecosystem where forecasts, visual insights, and AI guidance feel seamless across every device."
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={Cloud}
            title="AeroWeather"
            desc="Real-time weather intelligence platform focused on performance, smooth UI, and accurate forecasting using modern APIs and visual systems."
          />
          <InfoCard
            icon={FileText}
            title="Aerofilyx PDF Editor"
            desc="A lightweight and modern PDF editing platform designed for speed and simplicity, enabling efficient document workflows across devices."
          />
        </div>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Founder</h2>
          <p className={`${textSecondary} text-sm mb-3`}>Founded by Rick Das</p>
          <Link
            href="/rick-das"
            className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            Learn more about Rick Das
          </Link>
        </div>
      </section>

      <section className="mb-6">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            Upcoming Projects
          </h2>
          <p className={`${textSecondary} text-sm leading-relaxed`}>
            GameSaveSync by Rick Das - a next-generation cloud save synchronization
            system currently under development.
          </p>
          <p className={`${textSecondary} text-sm leading-relaxed mt-3`}>
            GameSaveSync is being built to help players sync and manage game progress
            across multiple devices with reliable cloud backups and fast restore
            workflows.
          </p>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <Icon className="w-5 h-5 text-indigo-400 mb-2" />
      <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
      <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
