"use client";

import { useEffect, useState } from "react";

import { StatsServerContent } from "@/features/wakatime/components/stats-server-content";

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

export default function Wakatime() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const init = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      try {
        // Fetch all time ranges in parallel
        const [
          last7Days,
          last30Days,
          last6Months,
          lastYear,
          allTime,
          allTimeData,
        ] = await Promise.all([
          fetch(`${baseUrl}/api/wakatime-stats?range=last_7_days`, {
            next: { revalidate: 86400 },
          }).then((res) => res.json()),
          fetch(`${baseUrl}/api/wakatime-stats?range=last_30_days`, {
            next: { revalidate: 86400 },
          }).then((res) => res.json()),
          fetch(`${baseUrl}/api/wakatime-stats?range=last_6_months`, {
            next: { revalidate: 86400 },
          }).then((res) => res.json()),
          fetch(`${baseUrl}/api/wakatime-stats?range=last_year`, {
            next: { revalidate: 86400 },
          }).then((res) => res.json()),
          fetch(`${baseUrl}/api/wakatime-stats?range=all_time`, {
            next: { revalidate: 86400 },
          }).then((res) => res.json()),
          fetch(`${baseUrl}/api/wakatime-all-time`, {
            next: { revalidate: 86400 },
          }).then((res) => res.json()),
        ]);

        setData({
          stats: {
            last_7_days: last7Days,
            last_30_days: last30Days,
            last_6_months: last6Months,
            last_year: lastYear,
            all_time: allTime,
          },
          allTimeData: allTimeData?.data,
          lastUpdated: allTimeData?.lastUpdated,
        });
      } catch (error) {
        console.error("Failed to fetch Wakatime data:", error);
        // Return empty data structure for graceful fallback
        const errorResponse = { error: "Failed to fetch" };

        return {
          stats: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            last_7_days: errorResponse as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            last_30_days: errorResponse as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            last_6_months: errorResponse as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            last_year: errorResponse as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            all_time: errorResponse as any,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          allTimeData: errorResponse as any,
          lastUpdated: new Date().toISOString(),
        };
      }
    };

    init();
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
            <p className="text-muted-foreground">
              Detailed insights from Wakatime tracking your coding activities,
              languages used, projects worked on, and productivity metrics.
            </p>
          </div>
        </PanelContent>
      </Panel>

      <StatsServerContent data={data} />
    </Panel>
  );
}
