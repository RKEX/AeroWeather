"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { 
  User, 
  Rocket, 
  Cpu, 
  Globe, 
  Award, 
  Cloud, 
  Mail, 
  Github, 
  Instagram,
  LucideIcon
} from "lucide-react";

export default function AboutPage() {
  const textSecondary = "text-white/70";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto px-6 py-20"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/15"
        >
          ← Back to Home
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About AeroWeather</h1>
        <p className={`${textSecondary} text-lg max-w-2xl mx-auto`}>
          AeroWeather is a modern weather intelligence platform designed to deliver real-time weather forecasts, hourly predictions, 7-day forecasts, radar visualization and AI-powered weather insights.
        </p>
      </motion.div>

      <motion.section variants={itemVariants} className="mb-20">
        <GlassCard className="p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white/5 flex items-center justify-center">
              <User className="w-16 h-16 text-white/40" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">About Our Founder</h2>
              <h3 className="text-indigo-300 font-medium mb-4 text-xl">Rick Das</h3>
              <p className={`${textSecondary} mb-6 leading-relaxed`}>
                Rick Das is a technology enthusiast and quantum computing research student building intelligent platforms using modern technologies. He is the founder and primary developer of AeroWeather, focusing on high-performance web engineering and data-driven insights.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FocusItem icon={Cloud} label="Weather Intelligence Systems" />
                <FocusItem icon={Cpu} label="Artificial Intelligence" />
                <FocusItem icon={Rocket} label="Quantum Computing Research" />
                <FocusItem icon={Globe} label="Modern Web Engineering" />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Achievements & Community</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <AchievementCard title="Google Cloud Arcade" description="200+ labs completed" />
          <AchievementCard title="Google Developers" description="Active member in multiple chapters" />
          <AchievementCard title="Innovator Status" description="Google Cloud & Maps Platform Innovator" />
          <AchievementCard title="Event Participation" description="Google I/O & Cloud Next 2024-2026" />
        </div>

        <h3 className="text-lg font-bold text-white/80 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          Recognized Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <BadgeItem name="GDG Cloud Kolkata" date="10 Feb 2026" />
          <BadgeItem name="GDG Cloud Bangkok" date="10 Feb 2026" />
          <BadgeItem name="GDG Cloud Lahore" date="10 Feb 2026" />
          <BadgeItem name="GDG Yangon" date="10 Feb 2026" />
          <BadgeItem name="GDG Kolkata" date="10 Feb 2026" />
          <BadgeItem name="GDG Raipur" date="10 Feb 2026" />
          <BadgeItem name="GDG Ranchi" date="10 Feb 2026" />
          <BadgeItem name="GDG Jodhpur" date="10 Feb 2026" />
          <BadgeItem name="GDG Durgapur" date="10 Feb 2026" />
          <BadgeItem name="GDG Baroda" date="10 Feb 2026" />
          <BadgeItem name="Google Cloud Innovator" date="6 Apr 2025" />
          <BadgeItem name="Maps Platform Innovator" date="6 Apr 2025" />
          <BadgeItem name="Google Cloud Innovators Get Certified" date="5 Aug 2025" />
          <BadgeItem name="Firebase Developer Community" date="4 Aug 2025" />
          <BadgeItem name="Google Cloud & NVIDIA Member" date="2 Aug 2025" />
          <BadgeItem name="Next 25 Attendee" date="10 Apr 2025" />
          <BadgeItem name="I/O 2025 Registered" date="3 Apr 2025" />
          <BadgeItem name="I/O 2024 Registered" date="30 Mar 2024" />
          <BadgeItem name="I/O 2026 Registered" date="14 Mar 2026" />
          <BadgeItem name="Google Skills" date="19 Jan 2025" />
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Connect with the Founder</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <SocialButton href="https://github.com/RKEX" icon={Github} label="GitHub" color="hover:bg-gray-800" />
          <SocialButton href="https://www.instagram.com/mr_rkex/" icon={Instagram} label="Instagram" color="hover:bg-pink-600" />
          <SocialButton href="mailto:rickd7587@gmail.com" icon={Mail} label="Email" color="hover:bg-indigo-600" />
        </div>
      </motion.section>
    </motion.main>
  );
}

function FocusItem({ icon: Icon, label }: { icon: LucideIcon, label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
      <Icon className="w-5 h-5 text-indigo-400" />
      <span className="text-white/80 text-sm font-medium">{label}</span>
    </div>
  );
}

function AchievementCard({ title, description }: { title: string, description: string }) {
  return (
    <GlassCard className="p-4 border-l-4 border-l-indigo-500">
      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
      <p className="text-white/60 text-xs">{description}</p>
    </GlassCard>
  );
}

function BadgeItem({ name, date }: { name: string, date: string }) {
  return (
    <GlassCard className="p-3 text-center transition-transform hover:scale-105">
      <div className="w-10 h-10 mx-auto mb-2 bg-indigo-500/20 rounded-full flex items-center justify-center">
        <Award className="w-6 h-6 text-indigo-300" />
      </div>
      <p className="text-white text-[10px] font-bold leading-tight mb-1 line-clamp-2">{name}</p>
      <p className="text-white/40 text-[8px] uppercase tracking-tighter">{date}</p>
    </GlassCard>
  );
}

function SocialButton({ href, icon: Icon, label, color }: { href: string, icon: LucideIcon, label: string, color: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white transition-all ${color} whitespace-nowrap`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </a>
  );
}
