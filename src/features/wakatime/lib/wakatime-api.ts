import { unstable_cache } from "next/cache";

export const WAKATIME_CACHE_TAG = "wakatime";

// Fallback TTL; the page asks for a revalidation shortly after it becomes active
const WAKATIME_CACHE_SECONDS = 86400;

const WAKATIME_API_BASE = "https://api.wakatime.com/api/v1";

export type WakatimeCachedResult<T> = {
  data: T;
  /** ISO time when the data was fetched from WakaTime */
  fetchedAt: string;
};

async function fetchFromWakatime<T>(
  path: string
): Promise<WakatimeCachedResult<T>> {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    throw new Error("Wakatime API key not configured");
  }

  const response = await fetch(`${WAKATIME_API_BASE}${path}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Wakatime request failed: ${response.status} ${path}`);
  }

  return {
    data: (await response.json()) as T,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetches a WakaTime API path through the Next.js data cache.
 * Everything is tagged with WAKATIME_CACHE_TAG so it can be revalidated together.
 */
export function getWakatimeCached<T>(path: string) {
  return unstable_cache(() => fetchFromWakatime<T>(path), ["wakatime", path], {
    revalidate: WAKATIME_CACHE_SECONDS,
    tags: [WAKATIME_CACHE_TAG],
  })();
}
