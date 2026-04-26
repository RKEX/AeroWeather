import { Metadata } from "next";

/**
 * AeroWeather SEO Configuration
 * Single source of truth for all SEO-related settings.
 */

export const SITE_CONFIG = {
  name: "AeroWeather",
  shortName: "AeroWeather",
  description: "AeroWeather provides real-time weather forecasts, hourly predictions, 7-day outlooks, and AI-powered atmospheric insights.",
  url: "https://www.aeroweather.app",
  ogImage: "https://www.aeroweather.app/og-image.png",
  twitterHandle: "@aeroweather",
  author: "Rick Das",
  links: {
    github: "https://github.com/RKEX",
    instagram: "https://www.instagram.com/mr_rkex",
  }
};

// Keyword Groups as requested
export const KEYWORD_GROUPS = {
  weatherForecast: ["weather forecast", "local weather", "7-day forecast", "hourly weather", "daily weather updates"],
  realTimeData: ["real-time weather data", "live weather updates", "current weather conditions", "live weather radar"],
  airQuality: ["air quality index", "AQI forecast", "pollution levels", "air quality monitoring", "smog alert"],
  rainForecast: ["rain forecast", "precipitation tracking", "storm tracker", "rainfall predictions", "monsoon updates"],
  weatherAnalytics: ["weather analytics", "meteorological data", "climate analysis", "atmospheric intelligence"],
  hyperlocal: ["hyperlocal weather", "street-level weather", "precision forecasting", "neighborhood weather"],
  blogInsights: ["weather blog", "meteorology insights", "climate science articles", "AeroWeather insights", "weather education"],
};

export const GLOBAL_KEYWORDS = [
  ...KEYWORD_GROUPS.weatherForecast,
  ...KEYWORD_GROUPS.realTimeData,
  ...KEYWORD_GROUPS.airQuality,
  ...KEYWORD_GROUPS.rainForecast,
  ...KEYWORD_GROUPS.weatherAnalytics,
  ...KEYWORD_GROUPS.hyperlocal,
  ...KEYWORD_GROUPS.blogInsights,
  "AeroWeather",
  "Rick Das",
  "precision weather",
];

const OPEN_GRAPH_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  bn: "bn_BD",
  hi: "hi_IN",
  zh: "zh_CN",
  ja: "ja_JP",
  ko: "ko_KR",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  ar: "ar_SA",
  ru: "ru_RU",
  pt: "pt_PT",
};

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  pathname?: string;
  locale?: string;
  type?: "website" | "article";
}

/**
 * generateMetadataFromConfig
 * Central helper to create Next.js Metadata objects.
 */
export function generateMetadataFromConfig({
  title,
  description,
  image = SITE_CONFIG.ogImage,
  noIndex = false,
  keywords = [],
  pathname = "/",
  locale = "en",
  type = "website",
}: MetadataProps = {}): Metadata {
  const canonicalUrl = `${SITE_CONFIG.url}${pathname === "/" ? "" : pathname}`;
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - Ultra Accurate Weather Forecast`;

  return {
    title: {
      default: fullTitle,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: description || SITE_CONFIG.description,
    keywords: Array.from(new Set([...GLOBAL_KEYWORDS, ...keywords])),
    authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.links.github }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title || SITE_CONFIG.name,
      description: description || SITE_CONFIG.description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
      locale: OPEN_GRAPH_LOCALE_MAP[locale] ?? "en_US",
      type: type,
    },
    twitter: {
      card: "summary_large_image",
      title: title || SITE_CONFIG.name,
      description: description || SITE_CONFIG.description,
      images: [image],
      creator: SITE_CONFIG.twitterHandle,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "5AQfg1BzRq4wAzL9_4IVKwgKmM6ubXUn9PpPVkletgA",
    },
  };
}
