export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  retries: number = 2,
  timeout: number = 5000
): Promise<T | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      if (retries > 0) {
        return safeFetch(url, options, retries - 1, timeout);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    if (retries > 0) {
      return safeFetch(url, options, retries - 1, timeout);
    }
    console.error(`SafeFetch failed for ${url}:`, error);
    return null;
  }
}
