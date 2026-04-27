import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-content";

import { POPULAR_CITIES } from "@/config/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aeroweather.app";

  const staticRoutes = [
    { path: "", changeFrequency: "hourly" as const, priority: 1 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/impact", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/love", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/travel", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/meditation", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/rick-das", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/blog", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/analytics", changeFrequency: "weekly" as const, priority: 0.6 },
  ];

  const forecastRoutes = [
    { path: "/weather/today", changeFrequency: "hourly" as const, priority: 0.9 },
    { path: "/weather/tomorrow", changeFrequency: "hourly" as const, priority: 0.9 },
  ];

  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const forecastPages = forecastRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogPostPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const cityUrls = POPULAR_CITIES.map((city) => ({
    url: `${baseUrl}/weather/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const impactCityUrls = POPULAR_CITIES.map((city) => ({
    url: `${baseUrl}/impact/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const loveCityUrls = POPULAR_CITIES.map((city) => ({
    url: `${baseUrl}/love/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const travelCityUrls = POPULAR_CITIES.map((city) => ({
    url: `${baseUrl}/travel/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const meditationCityUrls = POPULAR_CITIES.map((city) => ({
    url: `${baseUrl}/meditation/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages, 
    ...forecastPages, 
    ...blogPostPages, 
    ...cityUrls,
    ...impactCityUrls,
    ...loveCityUrls,
    ...travelCityUrls,
    ...meditationCityUrls
  ];
}