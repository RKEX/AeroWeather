"use client";

import {
  Award,
  BookOpen,
  Cloud,
  Code,
  Cpu,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Layers,
  LucideIcon,
  Mail,
  Rocket,
  Server,
  Shield,
  Star,
  User,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function AboutContent() {
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Structured Data for SEO: "Who is Rick Das" */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Rick Das",
            jobTitle: "Founder & CEO",
            worksFor: {
              "@type": "Organization",
              name: "AeroWeather",
              url: "https://aeroweather.vercel.app",
            },
            nationality: "Indian",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Kolkata",
              addressCountry: "India",
            },
            sameAs: [
              "https://g.dev/Dev_ops_rkex",
              "https://www.instagram.com/mr_rkex/",
              "https://github.com/RKEX",
            ],
            knowsAbout: [
              "Full-Stack Development",
              "Google Cloud Platform",
              "Artificial Intelligence",
              "Real-Time Weather Systems",
              "Quantum Computing",
              "Cloud Infrastructure",
            ],
          }),
        }}
      />

      {/* Back */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
        >
          ← Back
        </Link>
      </div>

      {/* AeroWeather Section */}
      <section className="mb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          About AeroWeather
        </h1>
        <p className={`${textSecondary} text-sm max-w-xl mx-auto`}>
          AeroWeather is a modern weather intelligence platform designed to
          deliver real-time forecasts, hourly predictions, 7-day outlooks, and
          radar-based insights.
          <br />
          <br />
          Built with a focus on performance, clarity, and design, it transforms
          complex weather data into a smooth and intuitive experience.
        </p>
      </section>

      {/* About Arvian */}
      <section className="mb-16">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <h2 className="text-xl font-bold text-white mb-3">About Arvian</h2>
          <p className={`${textSecondary} text-sm max-w-xl mx-auto`}>
            Aervian is a privacy-first digital brand focused on building simple,
            trustworthy, and high-performance tools for everyday work. We design
            experiences that are accessible, practical, and secure by default.
            <br />
            <br />
            Our approach is to combine modern web technology with clean product
            design, so people can get real work done quickly without sacrificing
            privacy or quality.
          </p>
        </div>
      </section>

      {/* Our Products */}
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

      {/* ===== FOUNDER SECTION — RICK DAS ===== */}
      <section className="mb-16" id="founder">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left mb-8">
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-white/40" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Rick Das</h2>
              <p className="text-indigo-300 text-sm mb-3 font-medium">
                Founder &amp; CEO of AeroWeather &bull; Co-founder of Arvian
              </p>

              {/* POWER INTRO — Knowledge Panel Paragraph */}
              <p className={`${textSecondary} text-sm leading-relaxed mb-4`}>
                Rick Das is the founder and developer of AeroWeather, a
                real-time weather intelligence platform built for performance,
                accuracy, and modern design. He is an Indian full-stack
                developer and quantum computing researcher based in Kolkata,
                India, actively involved in space science programs through both
                NASA and ISRO. Rick Das holds a NASA Virtual Guest designation
                with confirmed participation in NASA&apos;s Artemis mission
                activities, and is enrolled as an ISRO Student in the
                &quot;Scientific Observations from Space&quot; program
                (START-2026). He is currently pursuing a Bachelor of Science in
                Computer Science with Honours through a four-year degree
                program, and completed his Full Stack IT training at the Central
                Institute of Technology, Barasat, in 2023. As the founder of
                AeroWeather for work and as a quantum computing researcher in
                academics, Rick Das combines hands-on engineering expertise with
                advanced scientific inquiry.
              </p>

              {/* EXPANSION — NASA */}
              <p className={`${textSecondary} text-sm leading-relaxed mb-4`}>
                Rick Das is a registered NASA Virtual Guest, recognized through
                participation in live mission launches and space exploration
                events organized by the National Aeronautics and Space
                Administration. He holds an officially issued NASA Virtual Guest
                Passport (Second Edition), dated February 28, 2026, which
                confirms his engagement with NASA&apos;s Artemis program
                activities and public outreach initiatives. His involvement with
                NASA reflects a sustained interest in aerospace engineering,
                orbital mechanics, and the advancement of human space
                exploration. Rick Das draws direct inspiration from NASA&apos;s
                ongoing research in planetary science, deep-space communication,
                and next-generation launch vehicle technologies, which
                influences his approach to building data-intensive, real-time
                systems like AeroWeather.
              </p>

              {/* EXPANSION — ISRO */}
              <p className={`${textSecondary} text-sm leading-relaxed mb-4`}>
                In addition to his engagement with NASA, Rick Das is an enrolled
                ISRO Student, actively participating in the &quot;Scientific
                Observations from Space&quot; program (START-2026), organized by
                the Indian Space Research Organisation through its E-Class
                Electronic Collaborative Learning platform. This program covers
                space science, satellite-based earth observation, remote sensing
                methodologies, and scientific data interpretation from orbital
                instruments. Rick Das is deeply inspired by ISRO&apos;s
                pioneering contributions to satellite communications, planetary
                exploration missions, and cost-effective space technology, which
                further informs his development of cloud-based and real-time
                data processing architectures.
              </p>

              {/* EXPANSION — Quantum Computing */}
              <p className={`${textSecondary} text-sm leading-relaxed mb-4`}>
                Rick Das is engaged in advanced research in quantum computing
                under academic supervision, exploring quantum algorithms,
                quantum entanglement phenomena, quantum gate operations, and
                their potential applications in computational problem-solving,
                cryptography, and optimization. As a quantum computing
                researcher, he investigates how principles from quantum
                mechanics can be applied to accelerate data processing and solve
                complex computational challenges that are intractable for
                classical systems. This research positions Rick Das at the
                intersection of theoretical computer science and applied
                physics, complementing his practical engineering work in
                full-stack development and cloud infrastructure.
              </p>

              {/* EXPANSION — Education */}
              <p className={`${textSecondary} text-sm leading-relaxed mb-4`}>
                Rick Das completed his Full Stack IT training at the Central
                Institute of Technology, Barasat, in 2023, where he received
                comprehensive education in both front-end and back-end web
                development technologies, database management, version control
                systems, API development, and deployment pipelines. He is
                currently pursuing a four-year Bachelor of Science degree in
                Computer Science with Honours, covering advanced subjects
                including data structures and algorithms, operating systems,
                computer networks, software engineering, database systems, and
                artificial intelligence. His academic foundation provides the
                rigorous theoretical knowledge that underpins his practical work
                as a developer and the founder of AeroWeather.
              </p>

              {/* EXPANSION — Developer Identity */}
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                As the founder of AeroWeather, Rick Das leads all aspects of
                product architecture, engineering, and design. He specializes in
                building high-performance digital platforms, real-time weather
                intelligence systems, AI-driven technologies, scalable cloud
                infrastructure, and modern user interfaces. Rick Das is an
                extensively active participant in the Google Cloud ecosystem,
                with over 296 labs completed, 63 courses, 92 skill checks, 83
                skill badges, and memberships across numerous Google Developer
                Groups worldwide. His technical stack spans JavaScript,
                TypeScript, Python, C, C++, Java, Node.js, Bun, Next.js, React,
                Firebase, Prisma, MongoDB, Google Cloud Platform, and Terraform,
                reflecting a breadth of expertise that enables him to architect
                and deliver production-grade software systems at scale.
              </p>
            </div>
          </div>

          {/* Core Focus Areas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <FocusItem icon={Cloud} label="Weather Systems" />
            <FocusItem icon={Cpu} label="AI & ML Systems" />
            <FocusItem icon={Rocket} label="Quantum Research" />
            <FocusItem icon={Globe} label="Web Engineering" />
            <FocusItem icon={Server} label="Cloud Infrastructure" />
            <FocusItem icon={Layers} label="Real-Time Systems" />
            <FocusItem icon={Code} label="Full-Stack Development" />
            <FocusItem icon={Shield} label="Scalable Solutions" />
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Education
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white text-sm font-medium">
                  Full Stack IT — Central Institute of Technology, Barasat
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Completed in 2023. Comprehensive training in full-stack web
                  development, covering both front-end and back-end technologies,
                  databases, version control, and deployment pipelines.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white text-sm font-medium">
                  BSc Computer Science (Honours) — 4-Year Program (Ongoing)
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Currently pursuing a four-year Bachelor of Science degree in
                  Computer Science with Honours. The curriculum covers advanced
                  topics including data structures, algorithms, operating
                  systems, computer networks, software engineering, and
                  artificial intelligence.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white text-sm font-medium">
                  Quantum Computing Research — Under Academic Supervision
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Engaged in quantum computing research under academic
                  supervision, exploring quantum algorithms, quantum
                  entanglement, and their potential applications in computational
                  problem-solving and modern technology systems.
                </p>
              </div>
            </div>
          </div>

          {/* Research & Space Programs */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-400" />
              Research &amp; Space Programs
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white text-sm font-medium">
                  NASA Virtual Guest
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Registered as a NASA Virtual Guest, participating in live
                  mission launches and space exploration events hosted by NASA.
                  Holds a NASA Virtual Guest Passport (Second Edition), issued on
                  February 28, 2026, confirming engagement with NASA&apos;s public
                  outreach and virtual participation programs including the
                  Artemis mission activities. Rick Das is deeply inspired by the
                  ongoing research and achievements of NASA in space exploration
                  and aerospace technology.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white text-sm font-medium">
                  ISRO Student
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Enrolled as an ISRO Student, engaging with educational and
                  research programs organized by the Indian Space Research
                  Organisation. Participating in the &quot;Scientific Observations
                  from Space&quot; program (START-2026) through ISRO&apos;s
                  E-Class collaborative learning platform, studying space
                  science, satellite observations, and earth science research
                  methodologies. Rick Das is inspired by ISRO&apos;s pioneering
                  contributions to space technology, satellite communications,
                  and planetary exploration missions.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" />
              Technical Stack
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allTechStack.map((tech, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white/80 text-xs text-center"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* AeroWeather Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-400" />
              AeroWeather — Flagship Product
            </h3>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                Rick Das is the founder and developer of AeroWeather, a
                real-time weather intelligence platform engineered for accuracy,
                performance, and visual excellence. AeroWeather delivers
                comprehensive weather data including current conditions, hourly
                forecasts, 7-day outlooks, Air Quality Index (AQI) monitoring,
                interactive radar visualization, and dynamic weather-responsive
                UI elements.
              </p>
              <p className={`${textSecondary} text-sm leading-relaxed mt-3`}>
                The platform is built using Next.js and TypeScript, leveraging
                modern web APIs and a performance-first architecture. Rick Das
                designed AeroWeather with a focus on delivering a premium user
                experience through clean design, smooth animations, responsive
                layouts, and real-time data rendering optimized for both desktop
                and mobile devices.
              </p>
              <p className={`${textSecondary} text-sm leading-relaxed mt-3`}>
                Key features include real-time weather data with automatic
                location detection, interactive precipitation radar with
                timeline controls, AQI monitoring with pollutant breakdowns,
                dynamic sky backgrounds that reflect actual weather conditions,
                wind direction compass visualization, weather comparison mode for
                multiple cities, AI-driven weather insights, and PWA support for
                native-like mobile experiences.
              </p>
            </div>
          </div>

          {/* Google Cloud & Developer Profile */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Google Cloud &amp; Developer Profile
            </h3>
            <p className={`${textSecondary} text-sm mb-4 leading-relaxed`}>
              Rick Das is an extensively active member of the Google Cloud
              ecosystem, with a verified Google Developer Profile. He has
              demonstrated deep expertise across a wide range of Google Cloud
              technologies, AI and machine learning services, data analytics
              platforms, and cloud infrastructure tools. His Google Cloud Skills
              Boost profile reflects a significant volume of hands-on learning
              and practical experience.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <StatCard label="Labs Completed" value="296" />
              <StatCard label="Courses" value="63" />
              <StatCard label="Skill Checks" value="92" />
              <StatCard label="Lessons" value="78" />
              <StatCard label="Games" value="19" />
              <StatCard label="Skill Badges" value="83" />
              <StatCard label="Total Activities" value="200+" />
              <StatCard label="Certifications" value="Active" />
            </div>

            <p className={`${textSecondary} text-xs`}>
              Google Developer Profile:{" "}
              <a
                href="https://g.dev/Dev_ops_rkex"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline"
              >
                g.dev/Dev_ops_rkex
              </a>
            </p>
          </div>

          {/* All Google Cloud Skill Badges */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Google Cloud Skill Badges &amp; Certifications — Complete List
            </h3>
            <p className={`${textSecondary} text-xs mb-4`}>
              The following is the complete and unabridged list of all 83 skill
              badges and certifications earned by Rick Das on Google Cloud Skills
              Boost. Every badge listed below has been individually earned
              through hands-on lab completion and skill assessments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allGoogleBadges.map((b, i) => (
                <BadgeRow key={i} name={b.name} date={b.date} />
              ))}
            </div>
          </div>

          {/* Community & Memberships */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Community Memberships &amp; Programs
            </h3>
            <p className={`${textSecondary} text-sm mb-4 leading-relaxed`}>
              Rick Das is an active participant across the global Google
              developer community ecosystem. He holds memberships in numerous
              Google Developer Groups (GDG) across multiple cities and
              countries, and is actively engaged with Google Cloud, Firebase,
              NVIDIA, and other technology communities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allCommunityMemberships.map((m, i) => (
                <MembershipRow key={i} name={m.name} date={m.date} />
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Official Links
            </h3>
            <div className="space-y-2">
              <LinkRow
                label="Google Developer Profile"
                href="https://g.dev/Dev_ops_rkex"
              />
              <LinkRow
                label="Instagram"
                href="https://www.instagram.com/mr_rkex/"
              />
              <LinkRow
                label="GitHub"
                href="https://github.com/RKEX"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social / Connect */}
      <section className="text-center">
        <h2 className="text-xl font-bold text-white mb-6">Connect</h2>
        <div className="flex flex-wrap justify-center gap-3">
          <SocialButton
            href="https://github.com/RKEX"
            icon={Github}
            label="GitHub"
          />
          <SocialButton
            href="https://instagram.com/mr_rkex"
            icon={Instagram}
            label="Instagram"
          />
          <SocialButton
            href="mailto:rickd7587@gmail.com"
            icon={Mail}
            label="Email"
          />
          <SocialButton
            href="https://g.dev/Dev_ops_rkex"
            icon={Star}
            label="Google Dev"
          />
        </div>
      </section>
    </main>
  );
}

// ===== SUB-COMPONENTS =====

function ProductCard({
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
      <p className="text-white/60 text-xs">{desc}</p>
    </div>
  );
}

function FocusItem({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-white/5 border border-white/10">
      <Icon className="w-4 h-4 text-indigo-400" />
      <span className="text-white/80 text-xs">{label}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
      <p className="text-white text-lg font-bold">{value}</p>
      <p className="text-white/50 text-[10px] mt-1">{label}</p>
    </div>
  );
}

function BadgeRow({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-white/10">
      <Award className="w-3.5 h-3.5 text-indigo-300 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-white text-[11px] leading-tight">{name}</p>
        <p className="text-white/40 text-[9px]">{date}</p>
      </div>
    </div>
  );
}

function MembershipRow({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-white/10">
      <Users className="w-3.5 h-3.5 text-indigo-300 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-white text-[11px] leading-tight">{name}</p>
        <p className="text-white/40 text-[9px]">{date}</p>
      </div>
    </div>
  );
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 rounded-md bg-white/5 border border-white/10 text-indigo-400 text-xs hover:bg-white/10 transition-colors"
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="underline">{label}</span>
      <span className="text-white/40 text-[10px] ml-auto truncate max-w-[200px]">
        {href}
      </span>
    </a>
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

// ===== DATA =====

const allTechStack = [
  "JavaScript",
  "TypeScript",
  "Python",
  "C",
  "C++",
  "Java",
  "Node.js",
  "Bun",
  "Next.js",
  "React",
  "Firebase",
  "Prisma",
  "MongoDB",
  "Google Cloud Platform",
  "AI & Machine Learning",
  "Cloud Infrastructure",
  "Real-Time Data Systems",
  "Terraform",
];

// COMPLETE list of ALL 83 Google Cloud Skill Badges (unabridged)
const allGoogleBadges = [
  { name: "Explore Generative AI with the Gemini API in Vertex AI", date: "Earned May 28, 2025" },
  { name: "Introduction to Generative AI", date: "Earned May 28, 2025" },
  { name: "Build a Data Mesh with Dataplex", date: "Earned May 27, 2025" },
  { name: "Integrate BigQuery Data and Google Workspace using Apps Script", date: "Earned May 27, 2025" },
  { name: "Implementing Cloud Load Balancing for Compute Engine", date: "Earned May 26, 2025" },
  { name: "Automate Data Capture at Scale with Document AI", date: "Earned May 24, 2025" },
  { name: "Configure Service Accounts and IAM Roles for Google Cloud", date: "Earned May 24, 2025" },
  { name: "Work Meets Play: Rapid Runs", date: "Earned May 24, 2025" },
  { name: "Skills Boost Arcade Trivia May 2025 Week 4", date: "Earned May 22, 2025" },
  { name: "Analyze BigQuery Data in Connected Sheets", date: "Earned May 22, 2025" },
  { name: "Skills Boost Arcade Certification Zone May 2025", date: "Earned May 22, 2025" },
  { name: "Build Infrastructure with Terraform on Google Cloud", date: "Earned May 21, 2025" },
  { name: "Perform Predictive Data Analysis in BigQuery", date: "Earned May 19, 2025" },
  { name: "Skills Boost Arcade Trivia May 2025 Week 3", date: "Earned May 19, 2025" },
  { name: "Level 3: Building Blocks", date: "Earned May 19, 2025" },
  { name: "Skills Boost Arcade Trivia May 2025 Week 2", date: "Earned May 16, 2025" },
  { name: "Skills Boost Arcade Trivia May 2025 Week 1", date: "Earned May 16, 2025" },
  { name: "Build LookML Objects in Looker", date: "Earned May 15, 2025" },
  { name: "Set Up an App Dev Environment on Google Cloud", date: "Earned May 15, 2025" },
  { name: "Arcade NetworSkills", date: "Earned May 15, 2025" },
  { name: "Skills Boost Arcade Base Camp May 2025", date: "Earned May 6, 2025" },
  { name: "Deploy Kubernetes Applications on Google Cloud", date: "Earned May 2, 2025" },
  { name: "Enrich Metadata and Discovery of BigLake Data", date: "Earned May 2, 2025" },
  { name: "Create a Secure Data Lake on Cloud Storage", date: "Earned May 2, 2025" },
  { name: "Secure BigLake Data", date: "Earned May 2, 2025" },
  { name: "Set Up a Google Cloud Network", date: "Earned May 2, 2025" },
  { name: "Monitor and Manage Google Cloud Resources", date: "Earned May 2, 2025" },
  { name: "Streaming Analytics into BigQuery", date: "Earned May 2, 2025" },
  { name: "DEPRECATED Networking Fundamentals on Google Cloud", date: "Earned May 1, 2025" },
  { name: "Monitoring in Google Cloud", date: "Earned Apr 30, 2025" },
  { name: "Analyze Images with the Cloud Vision API", date: "Earned Apr 30, 2025" },
  { name: "Get Started with Eventarc", date: "Earned Apr 30, 2025" },
  { name: "Develop with Apps Script and AppSheet", date: "Earned Apr 27, 2025" },
  { name: "App Building with AppSheet", date: "Earned Apr 27, 2025" },
  { name: "Get Started with Google Workspace Tools", date: "Earned Apr 27, 2025" },
  { name: "Build Real World AI Applications with Gemini and Imagen", date: "Earned Apr 27, 2025" },
  { name: "Store, Process, and Manage Data on Google Cloud - Command Line", date: "Earned Apr 27, 2025" },
  { name: "Store, Process, and Manage Data on Google Cloud - Console", date: "Earned Apr 27, 2025" },
  { name: "Analyze Speech and Language with Google APIs", date: "Earned Apr 27, 2025" },
  { name: "Using the Google Cloud Speech API", date: "Earned Apr 27, 2025" },
  { name: "Cloud Speech API: 3 Ways", date: "Earned Apr 27, 2025" },
  { name: "Skills Boost Arcade Trivia April 2025 Week 4", date: "Earned Apr 25, 2025" },
  { name: "Skills Boost Arcade Trivia April 2025 Week 3", date: "Earned Apr 25, 2025" },
  { name: "Skills Boost Arcade Certification Zone April 2025", date: "Earned Apr 25, 2025" },
  { name: "Cloud Run Functions: 3 Ways", date: "Earned Apr 15, 2025" },
  { name: "App Engine: 3 Ways", date: "Earned Apr 15, 2025" },
  { name: "Create a Streaming Data Lake on Cloud Storage", date: "Earned Apr 15, 2025" },
  { name: "Use APIs to Work with Cloud Storage", date: "Earned Apr 15, 2025" },
  { name: "Get Started with Cloud Storage", date: "Earned Apr 15, 2025" },
  { name: "Get Started with Looker", date: "Earned Apr 14, 2025" },
  { name: "[DEPRECATED] Building Complex End to End Self-Service Experiences in Dialogflow CX", date: "Earned Apr 14, 2025" },
  { name: "Conversational AI on Vertex AI and Dialogflow CX", date: "Earned Apr 14, 2025" },
  { name: "Get Started with Dataplex", date: "Earned Apr 14, 2025" },
  { name: "Get Started with API Gateway", date: "Earned Apr 14, 2025" },
  { name: "Get Started with Pub/Sub", date: "Earned Apr 14, 2025" },
  { name: "The Basics of Google Cloud Compute", date: "Earned Apr 13, 2025" },
  { name: "Machine Learning Operations (MLOps) with Vertex AI: Model Evaluation", date: "Earned Apr 13, 2025" },
  { name: "Customer Experience with Google AI Architecture", date: "Earned Apr 13, 2025" },
  { name: "Responsible AI for Digital Leaders with Google Cloud", date: "Earned Apr 13, 2025" },
  { name: "Responsible AI: Applying AI Principles with Google Cloud", date: "Earned Apr 13, 2025" },
  { name: "Google Calendar", date: "Earned Apr 13, 2025" },
  { name: "Google Sheets", date: "Earned Apr 13, 2025" },
  { name: "Google Meet", date: "Earned Apr 13, 2025" },
  { name: "Google Slides", date: "Earned Apr 13, 2025" },
  { name: "Google Docs", date: "Earned Apr 13, 2025" },
  { name: "Google Drive", date: "Earned Apr 13, 2025" },
  { name: "Trust and Security with Google Cloud", date: "Earned Apr 13, 2025" },
  { name: "Innovating with Google Cloud Artificial Intelligence", date: "Earned Apr 13, 2025" },
  { name: "Scaling with Google Cloud Operations", date: "Earned Apr 13, 2025" },
  { name: "Modernize Infrastructure and Applications with Google Cloud", date: "Earned Apr 13, 2025" },
  { name: "Exploring Data Transformation with Google Cloud", date: "Earned Apr 13, 2025" },
  { name: "Digital Transformation with Google Cloud", date: "Earned Apr 13, 2025" },
  { name: "Get Started with Sensitive Data Protection", date: "Earned Apr 12, 2025" },
  { name: "Level 3: The Arcade Quiz", date: "Earned Apr 12, 2025" },
  { name: "Level 2: Cloud Infrastructure & API Essentials", date: "Earned Apr 12, 2025" },
  { name: "Arcade TechCare", date: "Earned Apr 11, 2025" },
  { name: "Skills Boost Arcade Base Camp April 2025", date: "Earned Apr 10, 2025" },
  { name: "Skills Boost Arcade Trivia April 2025 Week 2", date: "Earned Apr 8, 2025" },
  { name: "Level 1: Application Development and Security with GCP", date: "Earned Apr 8, 2025" },
  { name: "Share Data Using Google Data Cloud", date: "Earned Apr 6, 2025" },
  { name: "Analyze Sentiment with Natural Language API", date: "Earned Apr 5, 2025" },
  { name: "Skills Boost Arcade Trivia April 2025 Week 1", date: "Earned Apr 5, 2025" },
  { name: "DEPRECATED Site Reliability Engineering: Measuring and Managing Reliability", date: "Earned 2025" },
];

// COMPLETE list of ALL community memberships
const allCommunityMemberships = [
  { name: "Gemini Enterprise Agent Ready", date: "19 Mar 2026" },
  { name: "Google I/O 2026 — Registered", date: "14 Mar 2026" },
  { name: "GDG on Campus Sister Nivedita University — Kolkata, India (Member)", date: "10 Feb 2026" },
  { name: "GDG Yangon (Member)", date: "10 Feb 2026" },
  { name: "GDG Cloud Lahore (Member)", date: "10 Feb 2026" },
  { name: "GDG Raipur (Member)", date: "10 Feb 2026" },
  { name: "GDG Kolkata (Member)", date: "10 Feb 2026" },
  { name: "GDG Ranchi (Member)", date: "10 Feb 2026" },
  { name: "GDG on Campus Techno India University — Kolkata, India (Member)", date: "10 Feb 2026" },
  { name: "GDG Durgapur (Member)", date: "10 Feb 2026" },
  { name: "GDG Jodhpur (Member)", date: "10 Feb 2026" },
  { name: "GDG on Campus JIS University — Kolkata, India (Member)", date: "10 Feb 2026" },
  { name: "GDG Baroda (Member)", date: "10 Feb 2026" },
  { name: "GDG Cloud (Member)", date: "10 Feb 2026" },
  { name: "GDG on Campus (Member)", date: "10 Feb 2026" },
  { name: "GDG Cloud (Member, additional chapter)", date: "10 Feb 2026" },
  { name: "GDG on Campus (Member, additional chapter)", date: "10 Feb 2026" },
  { name: "GDG on Campus — Kolkata, India (Member)", date: "10 Feb 2026" },
  { name: "Google Developer Group Member", date: "29 Oct 2025" },
  { name: "Google Developer Group on Campus Member", date: "28 Oct 2025" },
  { name: "Google Developer Group Discovery", date: "4 Sep 2025" },
  { name: "Google Cloud Innovators Get Certified 2025", date: "5 Aug 2025" },
  { name: "Firebase Studio Developer Community", date: "4 Aug 2025" },
  { name: "Code Wiki", date: "4 Aug 2025" },
  { name: "Google Cloud & NVIDIA Community Member", date: "2 Aug 2025" },
  { name: "Cloud Forums User", date: "23 Jul 2025" },
  { name: "Next 25 Attendee", date: "10 Apr 2025" },
  { name: "Google Cloud Innovator", date: "6 Apr 2025" },
  { name: "Google Maps Platform Innovators", date: "6 Apr 2025" },
  { name: "Google I/O 2025 — Registered", date: "3 Apr 2025" },
  { name: "Google Skills", date: "19 Jan 2025" },
  { name: "Google I/O 2024 — Registered", date: "30 Mar 2024" },
];