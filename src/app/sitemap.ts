import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aeroweather.app'
  
  const popularCities = [
    'kolkata', 'delhi', 'mumbai', 'bangalore', 'chennai', 'hyderabad', 'pune', 
    'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 
    'bhopal', 'patna', 'ranchi', 'guwahati', 'bhubaneswar', 'coimbatore', 
    'kochi', 'visakhapatnam', 'london', 'new-york', 'tokyo', 'seoul', 
    'singapore', 'dubai', 'paris', 'berlin', 'rome', 'madrid', 'toronto', 
    'sydney', 'melbourne', 'los-angeles', 'chicago', 'san-francisco', 
    'hong-kong', 'shanghai', 'beijing', 'bangkok', 'kuala-lumpur', 
    'jakarta', 'manila', 'cape-town', 'johannesburg', 'istanbul', 
    'moscow', 'rio-de-janeiro'
  ]

  const cityUrls = popularCities.map((city) => ({
    url: `${baseUrl}/weather/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const mainUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/weather/today`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/weather/tomorrow`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  return [...mainUrls, ...cityUrls]
}
