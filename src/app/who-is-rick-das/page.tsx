import { Metadata } from "next";
import Link from "next/link";

/* ─────────── METADATA (SSR) ─────────── */
export const metadata: Metadata = {
  title:
    "Who is Rick Das? | Founder of AeroWeather, Developer & Researcher",
  description:
    "Rick Das is the founder and developer of AeroWeather, a NASA Virtual Guest, ISRO START-2026 participant, quantum computing researcher, and BSc Computer Science (Hons) student based in Kolkata, India. Full biography, achievements, and developer profile.",
  keywords: [
    "who is Rick Das",
    "Rick Das developer",
    "Rick Das founder",
    "Rick Das AeroWeather",
    "Rick Das biography",
    "Rick Das NASA ISRO",
    "Rick Das quantum computing",
    "Rick Das Google Cloud",
    "Rick Das Kolkata",
    "Rick Das full stack developer",
    "AeroWeather founder",
  ],
  alternates: {
    canonical: "https://www.aeroweather.app/who-is-rick-das",
  },
  openGraph: {
    title: "Who is Rick Das? | Founder of AeroWeather",
    description:
      "Rick Das is the founder of AeroWeather, NASA Virtual Guest, ISRO student, quantum computing researcher, and full-stack developer from Kolkata, India.",
    url: "https://www.aeroweather.app/who-is-rick-das",
    siteName: "AeroWeather",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Who is Rick Das? | Founder of AeroWeather",
    description:
      "Rick Das — Founder of AeroWeather, NASA Virtual Guest, ISRO student, quantum computing researcher.",
  },
};

/* ─────────── JSON-LD STRUCTURED DATA ─────────── */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rick Das",
  url: "https://www.aeroweather.app/who-is-rick-das",
  image: "https://www.aeroweather.app/og-image.png",
  sameAs: [
    "https://github.com/RKEX",
    "https://www.instagram.com/mr_rkex",
    "https://g.dev/Dev_ops_rkex",
  ],
  jobTitle: "Founder & CEO",
  worksFor: {
    "@type": "Organization",
    name: "AeroWeather",
    url: "https://www.aeroweather.app",
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Central Institute of Technology, Barasat",
    },
  ],
  nationality: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Full-Stack Web Development",
    "Quantum Computing",
    "Google Cloud Platform",
    "Artificial Intelligence",
    "Real-Time Weather Systems",
    "Cloud Infrastructure",
    "Machine Learning",
    "Next.js",
    "TypeScript",
    "Terraform",
    "NASA Space Programs",
    "ISRO Research Programs",
  ],
  description:
    "Rick Das is an Indian full-stack developer and quantum computing researcher based in Kolkata, India. He is the founder and developer of AeroWeather, a real-time weather intelligence platform. Rick Das is a registered NASA Virtual Guest with participation in the Artemis mission, an ISRO Student enrolled in the START-2026 program, and is currently pursuing a BSc in Computer Science (Honours). He has completed 296 labs, 63 courses, and earned 83 skill badges on Google Cloud Skills Boost.",
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Full Stack IT Certification",
      credentialCategory: "certificate",
      recognizedBy: {
        "@type": "EducationalOrganization",
        name: "Central Institute of Technology, Barasat",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "NASA Virtual Guest Passport (Second Edition)",
      credentialCategory: "certificate",
      recognizedBy: {
        "@type": "Organization",
        name: "NASA - National Aeronautics and Space Administration",
      },
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Rick Das?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rick Das is an Indian full-stack developer and quantum computing researcher based in Kolkata, India. He is the founder and developer of AeroWeather, a real-time weather intelligence platform. He is a registered NASA Virtual Guest, ISRO START-2026 participant, and currently pursuing a BSc in Computer Science (Honours).",
      },
    },
    {
      "@type": "Question",
      name: "What is AeroWeather?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AeroWeather is a real-time weather intelligence platform founded and developed by Rick Das. Built with Next.js and TypeScript, it provides real-time forecasts, AQI monitoring, interactive radar, dynamic weather-responsive UI, and AI-driven weather insights.",
      },
    },
    {
      "@type": "Question",
      name: "Is Rick Das involved with NASA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Rick Das is a registered NASA Virtual Guest who has participated in live mission launches and space exploration events. He holds an officially issued NASA Virtual Guest Passport (Second Edition), dated February 28, 2026, confirming his engagement with NASA's Artemis program activities.",
      },
    },
    {
      "@type": "Question",
      name: "Is Rick Das involved with ISRO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Rick Das is an enrolled ISRO Student, actively participating in the 'Scientific Observations from Space' program (START-2026), organized by the Indian Space Research Organisation through its E-Class Electronic Collaborative Learning platform.",
      },
    },
  ],
};

/* ─────────── PAGE COMPONENT ─────────── */
export default function WhoIsRickDasPage() {
  const ts = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Back */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
        >
          ← Back to Home
        </Link>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Who is Rick Das?
        </h1>

        {/* POWER INTRO — Paragraph 1 */}
        <p className={`${ts} text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-4`}>
          Rick Das is the founder and developer of AeroWeather, a real-time
          weather intelligence platform engineered for performance, accuracy, and
          modern design. He is an Indian full-stack developer, quantum computing
          researcher, and active participant in international space science
          programs, based in Kolkata, India. Rick Das holds an official NASA
          Virtual Guest designation with confirmed participation in NASA&apos;s
          Artemis mission activities, and is enrolled as an ISRO Student in the
          &quot;Scientific Observations from Space&quot; program (START-2026)
          conducted by the Indian Space Research Organisation. He is currently
          pursuing a four-year Bachelor of Science degree in Computer Science
          with Honours, and completed his Full Stack IT training at the Central
          Institute of Technology, Barasat, in 2023. As a quantum computing
          researcher working under academic supervision, Rick Das bridges the
          gap between advanced scientific inquiry and practical software
          engineering, combining deep technical knowledge with hands-on
          development expertise to architect and deliver production-grade digital
          platforms.
        </p>

        {/* EXPANSION — Paragraph 2 */}
        <p className={`${ts} text-sm md:text-base leading-relaxed max-w-3xl mx-auto`}>
          Rick Das is recognized through his participation in NASA&apos;s public
          outreach and virtual engagement programs, holding a NASA Virtual Guest
          Passport (Second Edition) issued on February 28, 2026, which
          documents his involvement in the Artemis mission activities and live
          launch events organized by the National Aeronautics and Space
          Administration. Concurrently, he is engaged with ISRO&apos;s
          educational initiatives through the START-2026 program, studying
          space science, satellite-based earth observation, and remote sensing
          methodologies on ISRO&apos;s E-Class collaborative learning platform.
          His quantum computing research explores quantum algorithms,
          entanglement phenomena, quantum gate operations, and their
          applications in computational optimization and cryptography. His
          formal education includes a comprehensive Full Stack IT certification
          from the Central Institute of Technology, Barasat, and an ongoing
          BSc Computer Science (Honours) degree covering data structures,
          algorithms, operating systems, computer networks, software
          engineering, and artificial intelligence.
        </p>
      </section>

      {/* ═══════════════ FULL BIO ═══════════════ */}
      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            Full Biography of Rick Das — Founder of AeroWeather
          </h2>

          {/* Early Profile */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Early Profile and Developer Journey
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              Rick Das is an Indian full-stack developer based in Kolkata, West
              Bengal, India. From the early stages of his career, Rick Das
              developed a strong interest in building high-performance web
              applications, real-time data systems, and cloud-native
              architectures. He completed his Full Stack IT training at the
              Central Institute of Technology, Barasat, in 2023, where he
              received hands-on education in front-end development, back-end
              server technologies, database management systems, RESTful API
              design, version control with Git, and modern deployment pipelines.
              This foundational training equipped Rick Das with the practical
              engineering skills necessary to conceive, build, and launch
              AeroWeather as a fully independent product.
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              Rick Das is currently pursuing a four-year Bachelor of Science
              degree in Computer Science with Honours, studying advanced
              subjects including data structures and algorithms, operating
              systems, computer networks, software engineering, database
              systems, discrete mathematics, and artificial intelligence. His
              academic curriculum provides the rigorous theoretical foundation
              that complements his practical development work, enabling him to
              approach complex engineering challenges with both analytical
              depth and executable precision. Rick Das applies the knowledge
              from his computer science education directly to the architecture
              and optimization of AeroWeather and other projects he leads.
            </p>
          </div>

          {/* AeroWeather */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              AeroWeather — The Flagship Platform
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              Rick Das is the founder and developer of AeroWeather, a real-time
              weather intelligence platform designed to deliver comprehensive,
              accurate, and visually engaging weather data to users worldwide.
              AeroWeather provides current weather conditions with automatic
              location detection, hourly weather forecasts with detailed
              breakdowns, 7-day weather outlooks, Air Quality Index (AQI)
              monitoring with pollutant-level analysis, interactive
              precipitation radar with timeline controls, dynamic sky
              backgrounds that reflect actual weather conditions in real time,
              wind direction compass visualization, weather comparison mode for
              analyzing multiple cities simultaneously, AI-driven weather
              insights and recommendations, and Progressive Web App (PWA)
              support for native-like mobile experiences.
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              The AeroWeather platform is built using Next.js and TypeScript,
              leveraging a performance-first architecture with optimized
              real-time data rendering, responsive layouts, and smooth
              micro-animations. Rick Das designed and engineered every aspect of
              AeroWeather, from the underlying API integration layer and data
              processing pipeline to the user-facing interface and visual design
              system. As the founder of AeroWeather, Rick Das continues to lead
              all product development, architectural decisions, feature
              implementations, and performance optimizations for the platform.
            </p>
          </div>

          {/* Technical Expertise */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Technical Expertise and Stack
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-4`}>
              Rick Das commands a comprehensive and versatile technical stack
              that spans multiple programming languages, frameworks, databases,
              and cloud platforms. His expertise enables him to design, build,
              and deploy full-stack applications from initial architecture
              through production deployment and ongoing optimization.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {techStack.map((t, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white/80 text-xs text-center"
                >
                  {t}
                </div>
              ))}
            </div>
            <p className={`${ts} text-sm leading-relaxed`}>
              Rick Das works across the full spectrum of modern web development:
              building responsive front-end interfaces with React and Next.js,
              architecting server-side APIs with Node.js and Bun, managing data
              with Firebase, Prisma, and MongoDB, provisioning cloud
              infrastructure with Terraform and Google Cloud Platform, and
              integrating AI and machine learning services into production
              applications. His ability to operate across all layers of the
              technology stack is what enables him to independently build and
              maintain a platform as complex as AeroWeather.
            </p>
          </div>

          {/* Google Cloud */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Google Cloud Ecosystem — Achievements and Profile
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-4`}>
              Rick Das is an extensively active and deeply invested member of
              the Google Cloud ecosystem. His Google Cloud Skills Boost profile
              reflects an extraordinary volume of hands-on learning, practical
              lab work, and verified skill assessments spanning cloud
              infrastructure, AI and machine learning, data analytics, security,
              networking, and application development on Google Cloud Platform.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">296</p>
                <p className="text-white/50 text-[10px]">Labs Completed</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">63</p>
                <p className="text-white/50 text-[10px]">Courses</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">92</p>
                <p className="text-white/50 text-[10px]">Skill Checks</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">78</p>
                <p className="text-white/50 text-[10px]">Lessons</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">19</p>
                <p className="text-white/50 text-[10px]">Games</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">83</p>
                <p className="text-white/50 text-[10px]">Skill Badges</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">200+</p>
                <p className="text-white/50 text-[10px]">Total Activities</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">Active</p>
                <p className="text-white/50 text-[10px]">Google Dev Profile</p>
              </div>
            </div>
            <p className={`${ts} text-xs`}>
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

          {/* Complete Badge List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Complete List of Google Cloud Skill Badges Earned by Rick Das
            </h3>
            <p className={`${ts} text-xs mb-4`}>
              The following is the complete, unabridged list of all 83 skill
              badges and certifications individually earned by Rick Das on
              Google Cloud Skills Boost through hands-on lab completion and
              verified skill assessments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {allBadges.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-white/10"
                >
                  <span className="text-indigo-300 text-[10px] mt-0.5 shrink-0">
                    &#9670;
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-[11px] leading-tight">
                      {b.name}
                    </p>
                    <p className="text-white/40 text-[9px]">{b.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SPACE SCIENCE & RESEARCH ═══════════════ */}
      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            Space Science and Research Involvement
          </h2>

          {/* NASA */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              NASA — Virtual Guest and Artemis Mission Engagement
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              Rick Das is a registered NASA Virtual Guest, recognized through
              his active participation in live mission launches and space
              exploration events organized by the National Aeronautics and Space
              Administration (NASA). He holds an officially issued NASA Virtual
              Guest Passport (Second Edition), dated February 28, 2026, which
              confirms his direct engagement with NASA&apos;s Artemis program
              activities and broader public outreach initiatives. The NASA
              Virtual Guest Passport is issued to participants who register for
              and engage with NASA&apos;s launch events, providing a documented
              record of involvement in humanity&apos;s return to the Moon under
              the Artemis program.
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              Rick Das&apos;s involvement with NASA extends beyond passive
              observation. His engagement reflects a sustained and genuine
              interest in aerospace engineering, orbital mechanics, planetary
              science, deep-space communication systems, and the advancement of
              human space exploration capabilities. Rick Das draws direct
              inspiration from NASA&apos;s cutting-edge research in launch
              vehicle technologies, International Space Station operations, and
              interplanetary mission architectures, which influences his
              approach to building data-intensive, real-time processing systems
              like AeroWeather. The principles of precision, reliability, and
              real-time telemetry that govern NASA&apos;s mission systems
              directly inform Rick Das&apos;s engineering philosophy.
            </p>
          </div>

          {/* ISRO */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              ISRO — Student Enrollment and START-2026 Program
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              In addition to his engagement with NASA, Rick Das is an enrolled
              ISRO Student, actively participating in the &quot;Scientific
              Observations from Space&quot; program, designated as START-2026,
              organized by the Indian Space Research Organisation (ISRO). This
              program is conducted through ISRO&apos;s E-Class Electronic
              Collaborative Learning platform and covers a comprehensive
              curriculum including space science fundamentals, satellite-based
              earth observation techniques, remote sensing methodologies,
              atmospheric science, and scientific data interpretation from
              orbital instruments and sensors.
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              Rick Das is deeply inspired by ISRO&apos;s pioneering
              contributions to cost-effective space technology, satellite
              communications, planetary exploration missions including
              Chandrayaan and Mangalyaan, and ISRO&apos;s role in advancing
              space-based weather monitoring and climate observation systems.
              His participation in the ISRO START-2026 program further informs
              his understanding of atmospheric data processing, satellite
              imagery analysis, and earth science methodologies, all of which
              contribute to his work in building weather intelligence systems
              like AeroWeather. Rick Das represents a new generation of
              Indian developers who combine hands-on software engineering with
              active engagement in space research and scientific education.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ QUANTUM COMPUTING ═══════════════ */}
      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            Quantum Computing Research
          </h2>
          <p className={`${ts} text-sm leading-relaxed mb-3`}>
            Rick Das is engaged in advanced research in quantum computing under
            academic supervision, positioning himself at the intersection of
            theoretical computer science and applied physics. His research
            explores the foundational principles and practical applications of
            quantum mechanics in computational problem-solving, including
            quantum algorithms, quantum entanglement phenomena, quantum gate
            operations, superposition-based parallelism, and quantum error
            correction strategies.
          </p>
          <p className={`${ts} text-sm leading-relaxed mb-3`}>
            As a quantum computing researcher, Rick Das investigates how
            principles derived from quantum mechanics can be harnessed to
            accelerate data processing, solve combinatorial optimization
            problems that are computationally intractable for classical systems,
            and advance the fields of quantum cryptography and secure
            communications. His research considers the implications of quantum
            computing for next-generation technology systems, including the
            potential for quantum-enhanced machine learning, quantum simulation
            of physical systems, and quantum-secured data transmission.
          </p>
          <p className={`${ts} text-sm leading-relaxed`}>
            This academic research complements Rick Das&apos;s practical
            engineering work. The analytical rigor and mathematical depth
            required in quantum computing research sharpens the problem-solving
            capabilities that Rick Das applies to his full-stack development
            work, cloud architecture design, and the real-time data processing
            systems that power AeroWeather. The combination of theoretical
            research in quantum computing and applied engineering in cloud-native
            web platforms makes Rick Das a uniquely positioned developer at the
            frontier of both computation and product development.
          </p>
        </div>
      </section>

      {/* ═══════════════ COMMUNITY MEMBERSHIPS ═══════════════ */}
      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            Community Memberships and Programs
          </h2>
          <p className={`${ts} text-sm leading-relaxed mb-4`}>
            Rick Das maintains active memberships across the global Google
            developer community ecosystem and technology organizations
            worldwide. He is actively engaged with Google Cloud, Google
            Developer Groups across multiple cities and countries, Firebase,
            NVIDIA, and other leading technology communities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allCommunity.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-white/10"
              >
                <span className="text-indigo-300 text-[10px] mt-0.5 shrink-0">
                  &#9670;
                </span>
                <div className="min-w-0">
                  <p className="text-white text-[11px] leading-tight">
                    {m.name}
                  </p>
                  <p className="text-white/40 text-[9px]">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ OFFICIAL LINKS ═══════════════ */}
      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">
            Official Links and Profiles
          </h2>
          <div className="space-y-2">
            {officialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-indigo-400 text-sm">{link.label}</span>
                <span className="text-white/40 text-xs truncate max-w-[220px]">
                  {link.href}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INTERNAL NAVIGATION ═══════════════ */}
      <section className="text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
          >
            About AeroWeather
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
          >
            AeroWeather Home
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ═══════════════ DATA ═══════════════ */

const techStack = [
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

const allBadges = [
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

const allCommunity = [
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

const officialLinks = [
  { label: "Google Developer Profile", href: "https://g.dev/Dev_ops_rkex" },
  { label: "Instagram", href: "https://www.instagram.com/mr_rkex/" },
  { label: "GitHub", href: "https://github.com/RKEX" },
];
