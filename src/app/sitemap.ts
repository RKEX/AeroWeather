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

  const cityUrls = popularCities.map((city) => ({
    url: `${baseUrl}/weather/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 1,
    },

    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },

    {
      url: `${baseUrl}/rick-das`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },

    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },

    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },

    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },

    // Footer navigation sections
    {
      url: `${baseUrl}/#weather-radar`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.7,
    },

    {
      url: `${baseUrl}/#city-weather`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.7,
    },

    {
      url: `${baseUrl}/#weather-maps`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.7,
    },
  ];

  const forecastPages = [
    {
      url: `${baseUrl}/weather/today`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },

    {
      url: `${baseUrl}/weather/tomorrow`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
  ];

  return [...staticPages, ...forecastPages, ...cityUrls];
}