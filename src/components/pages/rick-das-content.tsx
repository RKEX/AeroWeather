"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { getRickDasCopy } from "@/locales/rick-das";
import { Link } from "@/navigation";

export default function RickDasContent() {
  const { language } = useLanguage();
  const copy = getRickDasCopy(language);
  const ts = "text-white/70";
  const localizedRickDasUrl = "https://www.aeroweather.app/rick-das";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rick Das",
    url: localizedRickDasUrl,
    inLanguage: copy.faq.inLanguage,
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
    description: copy.metadata.personDescription,
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

  const multilingualFaqSnapshots = [
    {
      question: "Who is Rick Das?",
      answer:
        "Rick Das is the founder and developer of AeroWeather, a real-time weather intelligence platform.",
    },
    {
      question: "রিক দাস কে?",
      answer:
        "রিক দাস AeroWeather-এর প্রতিষ্ঠাতা ও ডেভেলপার, এবং একজন ফুল-স্ট্যাক ডেভেলপার ও গবেষক।",
    },
    {
      question: "रिक दास कौन हैं?",
      answer:
        "रिक दास AeroWeather के संस्थापक और डेवलपर हैं, और फुल-स्टैक डेवलपर व शोधकर्ता हैं।",
    },
    {
      question: "リック・ダスとは誰ですか？",
      answer:
        "リック・ダスはAeroWeatherの創設者兼開発者であり、フルスタック開発者です。",
    },
    {
      question: "릭 다스는 누구인가요?",
      answer:
        "릭 다스는 AeroWeather의 창립자이자 개발자이며 풀스택 개발자입니다.",
    },
    {
      question: "里克·达斯是谁？",
      answer:
        "里克·达斯是AeroWeather的创始人和开发者，也是全栈开发者。",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: [copy.faq.inLanguage, "en", "bn", "hi", "ja", "ko", "zh"],
    mainEntity: [
      {
        "@type": "Question",
        name: copy.faq.whoQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: copy.faq.whoAnswer,
        },
      },
      {
        "@type": "Question",
        name: copy.faq.whatQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: copy.faq.whatAnswer,
        },
      },
      {
        "@type": "Question",
        name: copy.faq.nasaQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: copy.faq.nasaAnswer,
        },
      },
      {
        "@type": "Question",
        name: copy.faq.isroQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: copy.faq.isroAnswer,
        },
      },
      ...multilingualFaqSnapshots.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.answer,
        },
      })),
    ],
  };

  const officialLinks = [
    { label: copy.officialGoogleDeveloperProfileLabel, href: "https://g.dev/Dev_ops_rkex" },
    { label: "Instagram", href: "https://www.instagram.com/mr_rkex/" },
    { label: "GitHub", href: "https://github.com/RKEX" },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
        >
          {copy.hero.backToHome}
        </Link>
      </div>

      <section className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {copy.hero.title}
        </h1>

        <p className={`${ts} text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-4`}>
          {copy.hero.paragraphs[0]}
        </p>

        <p className={`${ts} text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-4`}>
          {copy.hero.paragraphs[1]}
        </p>

        <p className={`${ts} text-sm md:text-base leading-relaxed max-w-3xl mx-auto`}>
          {copy.hero.paragraphs[2]}
        </p>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">{copy.projects.title}</h2>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">
              {copy.projects.gameSaveSyncTitle}
            </h3>
            <p className={`${ts} text-sm leading-relaxed`}>
              {copy.projects.paragraphs[0]}
            </p>
            <p className={`${ts} text-sm leading-relaxed mt-3`}>
              {copy.projects.paragraphs[1]}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            {copy.biography.title}
          </h2>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              {copy.biography.earlyProfile.title}
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              {copy.biography.earlyProfile.paragraphs[0]}
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              {copy.biography.earlyProfile.paragraphs[1]}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              {copy.biography.flagship.title}
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              {copy.biography.flagship.paragraphs[0]}
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              {copy.biography.flagship.paragraphs[1]}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              {copy.biography.technical.title}
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-4`}>
              {copy.biography.technical.intro}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {techStack.map((stackItem, index) => (
                <div
                  key={index}
                  className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white/80 text-xs text-center"
                >
                  {stackItem}
                </div>
              ))}
            </div>
            <p className={`${ts} text-sm leading-relaxed`}>
              {copy.biography.technical.outro}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              {copy.biography.googleCloud.title}
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-4`}>
              {copy.biography.googleCloud.intro}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">296</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.labsCompleted}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">63</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.courses}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">92</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.skillChecks}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">78</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.lessons}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">19</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.games}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">83</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.skillBadges}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">200+</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.totalActivities}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-white text-lg font-bold">{copy.biography.googleCloud.stats.profileStatus}</p>
                <p className="text-white/50 text-[10px]">{copy.biography.googleCloud.stats.googleDevProfile}</p>
              </div>
            </div>
            <p className={`${ts} text-xs`}>
              {copy.biography.googleCloud.profileLabel}:{" "}
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

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              {copy.biography.googleCloud.badgeListTitle}
            </h3>
            <p className={`${ts} text-xs mb-4`}>
              {copy.biography.googleCloud.badgeListDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {allBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-white/10"
                >
                  <span className="text-indigo-300 text-[10px] mt-0.5 shrink-0">
                    &#9670;
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-[11px] leading-tight">
                      {badge.name}
                    </p>
                    <p className="text-white/40 text-[9px]">{badge.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            {copy.spaceResearch.title}
          </h2>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              {copy.spaceResearch.nasa.title}
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              {copy.spaceResearch.nasa.paragraphs[0]}
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              {copy.spaceResearch.nasa.paragraphs[1]}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              {copy.spaceResearch.isro.title}
            </h3>
            <p className={`${ts} text-sm leading-relaxed mb-3`}>
              {copy.spaceResearch.isro.paragraphs[0]}
            </p>
            <p className={`${ts} text-sm leading-relaxed`}>
              {copy.spaceResearch.isro.paragraphs[1]}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            {copy.quantum.title}
          </h2>
          <p className={`${ts} text-sm leading-relaxed mb-3`}>
            {copy.quantum.paragraphs[0]}
          </p>
          <p className={`${ts} text-sm leading-relaxed mb-3`}>
            {copy.quantum.paragraphs[1]}
          </p>
          <p className={`${ts} text-sm leading-relaxed`}>
            {copy.quantum.paragraphs[2]}
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">
            {copy.community.title}
          </h2>
          <p className={`${ts} text-sm leading-relaxed mb-4`}>
            {copy.community.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allCommunity.map((membership, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-white/10"
              >
                <span className="text-indigo-300 text-[10px] mt-0.5 shrink-0">
                  &#9670;
                </span>
                <div className="min-w-0">
                  <p className="text-white text-[11px] leading-tight">
                    {membership.name}
                  </p>
                  <p className="text-white/40 text-[9px]">{membership.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">
            {copy.officialLinksTitle}
          </h2>
          <div className="space-y-2">
            {officialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-indigo-400 text-sm">{link.label}</span>
                <span className="text-white/40 text-xs truncate max-w-55">
                  {link.href}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
          >
            {copy.navigation.aboutAeroWeather}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
          >
            {copy.navigation.aeroWeatherHome}
          </Link>
        </div>
      </section>
    </main>
  );
}

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
  { name: "Next '26 Attendee", date: "16 Apr 2026" },
  { name: "Gemini Enterprise Agent Ready", date: "19 Mar 2026" },
  { name: "Google I/O 2026 - Registered", date: "14 Mar 2026" },
  { name: "GDG on Campus Sister Nivedita University - Kolkata, India (Member)", date: "10 Feb 2026" },
  { name: "GDG Yangon (Member)", date: "10 Feb 2026" },
  { name: "GDG Cloud Lahore (Member)", date: "10 Feb 2026" },
  { name: "GDG Raipur (Member)", date: "10 Feb 2026" },
  { name: "GDG Kolkata (Member)", date: "10 Feb 2026" },
  { name: "GDG Ranchi (Member)", date: "10 Feb 2026" },
  { name: "GDG on Campus Techno India University - Kolkata, India (Member)", date: "10 Feb 2026" },
  { name: "GDG Durgapur (Member)", date: "10 Feb 2026" },
  { name: "GDG Jodhpur (Member)", date: "10 Feb 2026" },
  { name: "GDG on Campus JIS University - Kolkata, India (Member)", date: "10 Feb 2026" },
  { name: "GDG Baroda (Member)", date: "10 Feb 2026" },
  { name: "GDG Cloud (Member)", date: "10 Feb 2026" },
  { name: "GDG on Campus (Member)", date: "10 Feb 2026" },
  { name: "GDG Cloud (Member, additional chapter)", date: "10 Feb 2026" },
  { name: "GDG on Campus (Member, additional chapter)", date: "10 Feb 2026" },
  { name: "GDG on Campus - Kolkata, India (Member)", date: "10 Feb 2026" },
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
  { name: "Google I/O 2025 - Registered", date: "3 Apr 2025" },
  { name: "Google Skills", date: "19 Jan 2025" },
  { name: "Google I/O 2024 - Registered", date: "30 Mar 2024" },
];
