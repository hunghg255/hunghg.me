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

export const WAKATIME_RANGES = [
  "last_7_days",
  "last_30_days",
  "last_6_months",
  "last_year",
  "all_time",
] as const;

export type WakatimeRangeKey = (typeof WAKATIME_RANGES)[number];

// The UI shows at most the top 5 of each list
const LIST_LIMIT = 10;

type Item = { name: string; percent: number; text: string };

function pickItems(items: unknown): Item[] {
  if (!Array.isArray(items)) return [];
  return items
    .slice(0, LIST_LIMIT)
    .map(({ name, percent, text }: Item) => ({ name, percent, text }));
}

const AI_FIELDS = [
  "ai_additions",
  "ai_deletions",
  "human_additions",
  "human_deletions",
  "ai_line_changes_total",
  "ai_model_breakdown",
  "ai_model_total_cost",
  "ai_input_tokens",
  "ai_cached_input_tokens",
  "ai_output_tokens",
  "ai_prompt_length_avg",
  "ai_prompt_events_total",
  "ai_prompt_events_avg_per_session",
  "ai_sessions",
] as const;

/**
 * Keeps only what the page renders. Raw stats for long ranges list every
 * project, dependency and machine and reach hundreds of kB.
 */
function slimStats(raw: { data?: Record<string, unknown> }) {
  const data = raw.data ?? {};

  return {
    data: {
      total_seconds: data.total_seconds,
      human_readable_total: data.human_readable_total,
      daily_average: data.daily_average,
      human_readable_daily_average: data.human_readable_daily_average,
      is_up_to_date: data.is_up_to_date,
      languages: pickItems(data.languages),
      projects: pickItems(data.projects),
      editors: pickItems(data.editors),
      categories: pickItems(data.categories),
      ...Object.fromEntries(AI_FIELDS.map((key) => [key, data[key] ?? null])),
    },
  };
}

async function fetchSnapshot() {
  const settled = await Promise.allSettled([
    fetchFromWakatime<{ data: Record<string, unknown> }>(
      "/users/current/all_time_since_today"
    ),
    ...WAKATIME_RANGES.map((range) =>
      fetchFromWakatime<{ data: Record<string, unknown> }>(
        `/users/current/stats/${range}`
      )
    ),
  ]);

  // Nothing worth caching; let the next request try again
  if (settled.every((result) => result.status === "rejected")) {
    throw new Error("All Wakatime requests failed");
  }

  const [allTime, ...stats] = settled.map((result) => {
    if (result.status === "fulfilled") return result.value.data;
    console.error("Wakatime request failed:", result.reason);
    return { error: "Failed to fetch" };
  });

  return {
    stats: Object.fromEntries(
      WAKATIME_RANGES.map((range, index) => {
        const item = stats[index];
        return [range, "error" in item ? item : slimStats(item)];
      })
    ) as Record<WakatimeRangeKey, unknown>,
    allTimeData: allTime,
    lastUpdated: new Date().toISOString(),
  };
}

/** Every range plus all-time totals, trimmed and cached as a single entry. */
export const getWakatimeSnapshot = unstable_cache(
  fetchSnapshot,
  ["wakatime", "snapshot"],
  { revalidate: WAKATIME_CACHE_SECONDS, tags: [WAKATIME_CACHE_TAG] }
);
