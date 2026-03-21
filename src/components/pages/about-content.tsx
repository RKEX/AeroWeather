"use client";

import {
  Award,
  Cloud,
  Cpu,
  FileText,
  Github,
  Globe,
  Instagram,
  LucideIcon,
  Mail,
  Rocket,
  User,
} from "lucide-react";
import Link from "next/link";

export default function AboutContent() {
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
        >
          ← Back
        </Link>
      </div>

      {/* 🌦️ AeroWeather */}
      <section className="mb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          About AeroWeather
        </h1>
        <p className={`${textSecondary} text-sm max-w-xl mx-auto`}>
          AeroWeather is a modern weather intelligence platform designed to deliver real-time forecasts, hourly predictions, 7-day outlooks, and radar-based insights.
          <br /><br />
          Built with a focus on performance, clarity, and design, it transforms complex weather data into a smooth and intuitive experience.
        </p>
      </section>

      {/* 🧠 Arvian */}
      <section className="mb-16">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <h2 className="text-xl font-bold text-white mb-3">About Arvian</h2>
          <p className={`${textSecondary} text-sm max-w-xl mx-auto`}>
            Aervian is a privacy-first digital brand focused on building simple, trustworthy, and high-performance tools for everyday work. We design experiences that are accessible, practical, and secure by default.
            <br /><br />
            Our approach is to combine modern web technology with clean product design, so people can get real work done quickly without sacrificing privacy or quality.
          </p>
        </div>
      </section>

      {/* 🚀 Products */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          Our Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductCard
            icon={Cloud}
            title="AeroWeather"
            desc="Real-time weather intelligence platform focused on performance, smooth UI, and accurate forecasting using modern APIs and visual systems."
          />

          <ProductCard
            icon={FileText}
            title="Aerofilyx PDF Editor"
            desc="A lightweight and modern PDF editing platform designed for speed and simplicity, enabling efficient document management across devices."
          />
        </div>
      </section>

      {/* 👨‍💻 Founder */}
      <section className="mb-16">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center">
              <User className="w-8 h-8 text-white/40" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-1">Rick Das</h2>

              {/* 🔥 NEW TITLE */}
              <p className="text-indigo-300 text-xs mb-3 font-medium">
                Founder of AeroWeather • Co-founder of Arvian
              </p>

              <p className={`${textSecondary} text-sm mb-4`}>
                Rick Das is focused on building high-performance digital platforms and next-generation systems.
                He works on modern web applications, AI-driven technologies, and scalable solutions with a strong emphasis on performance and user experience.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <FocusItem icon={Cloud} label="Weather Systems" />
                <FocusItem icon={Cpu} label="AI Systems" />
                <FocusItem icon={Rocket} label="Quantum Research" />
                <FocusItem icon={Globe} label="Web Engineering" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 Achievements */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          Achievements
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {badges.map((b, i) => (
            <BadgeItem key={i} name={b.name} date={b.date} />
          ))}
        </div>
      </section>

      {/* 🌐 Social */}
      <section className="text-center">
        <h2 className="text-xl font-bold text-white mb-6">Connect</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <SocialButton href="https://github.com/RKEX" icon={Github} label="GitHub" />
          <SocialButton href="https://instagram.com/mr_rkex" icon={Instagram} label="Instagram" />
          <SocialButton href="mailto:rickd7587@gmail.com" icon={Mail} label="Email" />
        </div>
      </section>
    </main>
  );
}

// 🔧 Components

function ProductCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <Icon className="w-5 h-5 text-indigo-400 mb-2" />
      <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
      <p className="text-white/60 text-xs">{desc}</p>
    </div>
  );
}

function FocusItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-white/5 border border-white/10">
      <Icon className="w-4 h-4 text-indigo-400" />
      <span className="text-white/80 text-xs">{label}</span>
    </div>
  );
}

function BadgeItem({ name, date }: { name: string; date: string }) {
  return (
    <div className="p-2 text-center rounded-md bg-white/5 border border-white/10">
      <Award className="w-4 h-4 mx-auto mb-1 text-indigo-300" />
      <p className="text-white text-[10px] leading-tight">{name}</p>
      <p className="text-white/40 text-[8px]">{date}</p>
    </div>
  );
}

function SocialButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
    >
      <Icon className="w-4 h-4" />
      {label}
    </a>
  );
}

// 📊 Badge data
const badges = [
  { name: "Google Cloud Arcade", date: "200+ Labs" },
  { name: "Google Developers", date: "Member" },
  { name: "Cloud Innovator", date: "2025" },
  { name: "Maps Innovator", date: "2025" },
  { name: "Firebase Community", date: "2025" },
  { name: "I/O 2025", date: "2025" },
  { name: "I/O 2024", date: "2024" },
  { name: "Next Attendee", date: "2025" },
];