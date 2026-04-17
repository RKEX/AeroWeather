import {
    DEFAULT_LOCALE,
    SUPPORTED_LOCALES,
    SupportedLocale,
} from "@/lib/locales";
import { defaultSEO } from "@/lib/seo-config";
import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "AeroWeather",
  description: defaultSEO.description,
  url: defaultSEO.url,
  ogImage: defaultSEO.ogImage,
  links: {
    github: defaultSEO.founder.github,
    instagram: defaultSEO.founder.instagramUrl,
  },
  author: defaultSEO.author,
  twitterHandle: defaultSEO.twitterHandle,
};

const founderSeoKeywords = Array.from(
  new Set([
    ...defaultSEO.keywords.filter((keyword) =>
      /rick\s*das|rkex|mr_rkex|aeroweather\s+founder|who\s+is\s+rick\s+das/i.test(
        keyword
      )
    ),
    "Rick Das founder",
    "Rick Das AeroWeather",
    "AeroWeather founder",
    "Rick Das biography",
    "Rick Das developer",
    "রিক দাস",
    "रिक दास",
    "リック・ダス",
    "릭 다스",
    "里克·达斯",
  ])
);

const OPEN_GRAPH_LOCALE_MAP: Record<SupportedLocale, string> = {
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

function normalizeMetadataPathname(pathname?: string): string {
  const trimmed = (pathname ?? "").trim();
  if (!trimmed || trimmed === "/") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function buildLocaleAlternates(
  pathname: string,
  locale: SupportedLocale
): Metadata["alternates"] {
  const normalizedPathname = normalizeMetadataPathname(pathname);

  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((targetLocale) => [
      targetLocale,
      `${SITE_CONFIG.url}/${targetLocale}${normalizedPathname}`,
    ])
  ) as Record<string, string>;

  languages["x-default"] =
    `${SITE_CONFIG.url}/${DEFAULT_LOCALE}${normalizedPathname}`;

  return {
    canonical: `${SITE_CONFIG.url}/${locale}${normalizedPathname}`,
    languages,
  };
}

export const metadataConfig = {
  home: {
    title: "AeroWeather - Live Weather Radar & Precision Forecasts",
    description: defaultSEO.description,
    keywords: defaultSEO.keywords,
  },
  weather: {
    title: "Detailed Weather Forecast - AeroWeather",
    description: "In-depth weather analysis, hourly breakdowns, and 7-day outlooks for your specific location.",
    keywords: ["hourly forecast", "weather details", "precision weather", "local outlook"],
  },
  about: {
    title: "About AeroWeather - Our Mission",
    description: "Learn about the technology and passion behind AeroWeather's precision forecasting system.",
  },
  contact: {
    title: "Contact Us - AeroWeather Support",
    description: "Get in touch with the AeroWeather team for support, feedback, or business inquiries.",
  },
  privacy: {
    title: "Privacy Policy - AeroWeather",
    description: "How we protect your data and respect your privacy at AeroWeather.",
  },
  terms: {
    title: "Terms of Service - AeroWeather",
    description: "The terms and conditions for using the AeroWeather platform.",
  },
  founder: {
    title: "Rick Das - Founder of AeroWeather",
    description:
      "Rick Das is the founder and developer of AeroWeather, a real-time weather intelligence platform based in West Bengal, India.",
    keywords: founderSeoKeywords,
  },
};

/**
 * Helper to generate Next.js Metadata objects from our config
 */
export function constructMetadata({
  title,
  description,
  image = SITE_CONFIG.ogImage,
  noIndex = false,
  keywords = [],
  locale = DEFAULT_LOCALE,
  pathname = "/",
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[] | null;
  locale?: SupportedLocale;
  pathname?: string;
} = {}): Metadata {
  const resolvedKeywords =
    keywords === null
      ? undefined
      : [...metadataConfig.home.keywords, ...(keywords ?? [])];
  const alternates = buildLocaleAlternates(pathname, locale);
  const canonicalUrl =
    typeof alternates?.canonical === "string" || alternates?.canonical instanceof URL
      ? alternates.canonical
      : `${SITE_CONFIG.url}/${locale}${normalizeMetadataPathname(pathname)}`;

  return {
    title: {
      default: title ? `${title} | AeroWeather` : SITE_CONFIG.name,
      template: "%s | AeroWeather",
    },
    description: description || SITE_CONFIG.description,
    ...(resolvedKeywords ? { keywords: resolvedKeywords } : {}),
    authors: [
      {
        name: SITE_CONFIG.author,
        url: SITE_CONFIG.links.github,
      },
    ],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates,
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
          alt: `${SITE_CONFIG.name} - Ultra Accurate Weather Forecast`,
        },
      ],
      locale: OPEN_GRAPH_LOCALE_MAP[locale] ?? "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || SITE_CONFIG.name,
      description: description || SITE_CONFIG.description,
      images: [image],
      creator: SITE_CONFIG.twitterHandle,
    },
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "any",
        },
      ],
      shortcut: "/favicon.ico",
    },
    verification: {
      google: "5AQfg1BzRq4wAzL9_4IVKwgKmM6ubXUn9PpPVkletgA",
    },
    other: {
      "google-adsense-account": "ca-pub-3928601593161247",
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
