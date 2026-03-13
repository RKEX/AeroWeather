import { LocationResult } from "@/types/weather";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const url = new URL(GEOCODING_API_URL);
    url.searchParams.append("name", query);
    url.searchParams.append("count", "10");
    url.searchParams.append("language", "en");
    url.searchParams.append("format", "json");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}
