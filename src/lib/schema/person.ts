// ============================================================
// AeroWeather — Person Schema (JSON-LD Structured Data)
// Founder : Rick Das
// Purpose : Helps Google display founder info, social links,
//           and Knowledge Panel in search results
// ============================================================

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",

  // ── Core Identity ─────────────────────────────────────────
  name: "Rick Das",
  alternateName: ["rick das", "RKEX", "mr_rkex", "rickd7587"],
  description:
    "Rick Das is the founder and developer of AeroWeather — an AI-powered real-time global weather forecast platform. He is a full-stack developer and indie hacker passionate about building useful tech products.",

  // ── Role & Organisation ───────────────────────────────────
  jobTitle: "Founder & Lead Developer",
  worksFor: {
    "@type": "Organization",
    name: "AeroWeather",
    url: "https://www.aeroweather.app",
    logo: "https://www.aeroweather.app/og-image.png",
    description:
      "AeroWeather is an AI-powered weather forecast platform providing real-time forecasts, radar maps, hourly predictions, and severe weather alerts for cities worldwide.",
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Rick Das",
    },
    sameAs: [
      "https://www.aeroweather.app",
    ],
  },

  // ── URLs & Social Profiles ────────────────────────────────
  url: "https://www.aeroweather.app",
  email: "support@aeroweather.app",

  sameAs: [
    // Primary project
    "https://www.aeroweather.app",
    "https://aeroweather.app",

    // GitHub
    "https://github.com/RKEX",

    // Instagram
    "https://instagram.com/mr_rkex",
    "https://www.instagram.com/mr_rkex",
  ],

  // ── Contact ───────────────────────────────────────────────
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@aeroweather.app",
    contactType: "Founder",
    url: "https://www.aeroweather.app/contact",
  },

  // ── Knowledge & Skills ────────────────────────────────────
  knowsAbout: [
    "Weather Forecasting",
    "Meteorology",
    "Artificial Intelligence",
    "Web Development",
    "Full Stack Development",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Weather APIs",
    "Data Visualization",
    "UI/UX Design",
    "Software Engineering",
    "Indie Hacking",
    "Product Development",
  ],

  // ── Location ──────────────────────────────────────────────
  nationality: {
    "@type": "Country",
    name: "India",
  },
  homeLocation: {
    "@type": "Place",
    name: "West Bengal, India",
    address: {
      "@type": "PostalAddress",
      addressRegion: "West Bengal",
      addressCountry: "IN",
    },
  },
};

// ── Organisation Schema (standalone, for <head> injection) ──
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AeroWeather",
  alternateName: "Aero Weather",
  url: "https://www.aeroweather.app",
  logo: "https://www.aeroweather.app/og-image.png",
  email: "support@aeroweather.app",
  description:
    "AeroWeather provides real-time weather forecasts, hourly predictions, 7-day outlooks, radar maps, and AI-powered weather insights for cities worldwide.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Rick Das",
    email: "support@aeroweather.app",
    sameAs: [
      "https://github.com/RKEX",
      "https://www.instagram.com/mr_rkex",
    ],
  },
  sameAs: [
    "https://www.aeroweather.app",
    "https://github.com/RKEX",
    "https://instagram.com/mr_rkex",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@aeroweather.app",
    contactType: "Customer Support",
    url: "https://www.aeroweather.app/contact",
  },
};

// ── Website Schema ───────────────────────────────────────────
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AeroWeather",
  url: "https://www.aeroweather.app",
  description:
    "Ultra accurate AI-powered weather forecasts for every city worldwide. Real-time radar, hourly forecasts, 7-day outlooks and severe weather alerts.",
  author: {
    "@type": "Person",
    name: "Rick Das",
    sameAs: [
      "https://github.com/RKEX",
      "https://www.instagram.com/mr_rkex",
    ],
  },
  creator: {
    "@type": "Person",
    name: "Rick Das",
  },
  publisher: {
    "@type": "Organization",
    name: "AeroWeather",
    url: "https://www.aeroweather.app",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.aeroweather.app/weather/{city}",
    },
    "query-input": "required name=city",
  },
};

// ── How to inject all 3 schemas into Next.js <head> ──────────
//
//  In your layout.tsx or _app.tsx:
//
//  import { personSchema, organizationSchema, websiteSchema } from "@/lib/person";
//
//  <Head>
//    <script
//      type="application/ld+json"
//      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
//    />
//    <script
//      type="application/ld+json"
//      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
//    />
//    <script
//      type="application/ld+json"
//      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
//    />
//  </Head>
//
// ─────────────────────────────────────────────────────────────