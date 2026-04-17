import { SUPPORTED_LOCALES } from "@/lib/locales";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aeroweather.app";

  const popularCities = [
    "kolkata","delhi","mumbai","bangalore","chennai","hyderabad","pune",
    "ahmedabad","surat","jaipur","lucknow","kanpur","nagpur","indore",
    "bhopal","patna","ranchi","guwahati","bhubaneswar","coimbatore",
    "kochi","visakhapatnam","london","new-york","tokyo","seoul",
    "singapore","dubai","paris","berlin","rome","madrid","toronto",
    "sydney","melbourne","los-angeles","chicago","san-francisco",
    "hong-kong","shanghai","beijing","bangkok","kuala-lumpur",
    "jakarta","manila","cape-town","johannesburg","istanbul",
    "moscow","rio-de-janeiro"
  ];

  const localizedStaticRoutes = [
    { path: "", changeFrequency: "hourly" as const, priority: 1 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/rick-das", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const localizedForecastRoutes = [
    { path: "/weather/today", changeFrequency: "hourly" as const, priority: 0.9 },
    { path: "/weather/tomorrow", changeFrequency: "hourly" as const, priority: 0.9 },
  ];

  const staticPages = SUPPORTED_LOCALES.flatMap((locale) =>
    localizedStaticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );

  const forecastPages = SUPPORTED_LOCALES.flatMap((locale) =>
    localizedForecastRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );

  const cityUrls = SUPPORTED_LOCALES.flatMap((locale) =>
    popularCities.map((city) => ({
      url: `${baseUrl}/${locale}/weather/${city}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...forecastPages, ...cityUrls];
}