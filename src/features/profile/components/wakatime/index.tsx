"use client";

import { useEffect, useState } from "react";

import { StatsServerContent } from "@/features/wakatime/components/stats-server-content";
import type { WakatimeStatsData } from "@/types/wakatime";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "../panel";

function StatsLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Overview skeleton */}
      <Panel id="overview" className="scroll-mt-22">
        <PanelHeader>
          <PanelTitle>Overview</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 rounded-lg border border-edge bg-muted"></div>
              </div>
            ))}
          </div>
        </PanelContent>
      </Panel>

      {/* Charts skeleton */}
      <Panel id="breakdown" className="scroll-mt-22">
        <PanelHeader>
          <PanelTitle>Activity Breakdown</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 rounded-lg border border-edge bg-muted"></div>
              </div>
            ))}
          </div>
        </PanelContent>
      </Panel>
    </div>
  );
}

const RANGES = [
  "last_7_days",
  "last_30_days",
  "last_6_months",
  "last_year",
  "all_time",
] as const;

// Revalidate this long after the page becomes active (opened or tab refocused)
const REVALIDATE_DELAY_MS = 5_000;
// Don't ask again sooner than this from the same tab
const REVALIDATE_MIN_INTERVAL_MS = 60_000;

async function fetchWakatimeData(fresh?: boolean): Promise<WakatimeStatsData> {
  // A unique query skips the CDN copy right after the server cache was cleared
  const url = fresh ? `/api/wakatime?v=${Date.now()}` : "/api/wakatime";
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch Wakatime data: ${res.status}`);
  }

  return res.json();
}

export default function Wakatime() {
  const [data, setData] = useState<WakatimeStatsData>();
  const [isRevalidating, setIsRevalidating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastRevalidateAt = 0;

    const load = async (fresh?: boolean) => {
      try {
        const next = await fetchWakatimeData(fresh);
        if (!cancelled) setData(next);
      } catch (error) {
        console.error("Failed to fetch Wakatime data:", error);
        if (!cancelled) {
          // Keep showing what we have; only fall back when there is nothing yet
          setData((prev) => prev ?? createErrorData());
        }
      }
    };

    const revalidate = async () => {
      lastRevalidateAt = Date.now();
      setIsRevalidating(true);
      try {
        const res = await fetch("/api/wakatime-revalidate", {
          method: "POST",
        });
        const { revalidated } = await res.json();
        if (revalidated) await load(true);
      } catch (error) {
        console.error("Failed to revalidate Wakatime data:", error);
      } finally {
        if (!cancelled) setIsRevalidating(false);
      }
    };

    const scheduleRevalidate = () => {
      clearTimeout(timer);
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastRevalidateAt < REVALIDATE_MIN_INTERVAL_MS) return;
      timer = setTimeout(revalidate, REVALIDATE_DELAY_MS);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleRevalidate();
      } else {
        clearTimeout(timer);
      }
    };

    load();
    scheduleRevalidate();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!data) {
    return <StatsLoadingSkeleton />;
  }

  return (
    <Panel id="wakatime">
      <PanelHeader>
        <PanelTitle>Wakatime</PanelTitle>
      </PanelHeader>

      <Panel id="wakatime-stats" className="scroll-mt-22">
        <PanelContent>
          <div className="space-y-4">
            <p className="font-mono text-sm text-muted-foreground">
              Detailed insights from Wakatime tracking your coding activities,
              languages used, projects worked on, and productivity metrics.
            </p>
          </div>
        </PanelContent>
      </Panel>

      <StatsServerContent data={data} isRevalidating={isRevalidating} />
    </Panel>
  );
}

function createErrorData(): WakatimeStatsData {
  const error = { error: "Failed to fetch" };

  return {
    stats: Object.fromEntries(
      RANGES.map((range) => [range, error])
    ) as WakatimeStatsData["stats"],
    allTimeData: error,
    lastUpdated: new Date().toISOString(),
  };
}
