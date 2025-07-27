"use client";

import {
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCard {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}

interface StatsOverviewStaticProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentStats: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allTimeData: any;
  range: string;
}

export function StatsOverviewStatic({
  currentStats,
  allTimeData,
  range,
}: StatsOverviewStaticProps) {
  if (!currentStats?.data || !allTimeData?.data) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Unable to load stats</p>
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      icon: ClockIcon,
      label: `Total (${getRangeDisplayName(range)})`,
      value: currentStats.data.human_readable_total || "0 mins",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: TrendingUpIcon,
      label: "Daily Average",
      value: currentStats.data.human_readable_daily_average || "0 mins",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: CalendarIcon,
      label: "All Time",
      value: allTimeData.data.text || "0 mins",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: TargetIcon,
      label: "Daily Avg (All Time)",
      value: formatSeconds(allTimeData.data.daily_average) || "0 mins",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-edge bg-background p-4 transition-colors hover:border-foreground/20"
        >
          <div className="flex items-center gap-3">
            <div className={cn("rounded-lg bg-muted p-2", stat.color)}>
              <stat.icon className="size-4" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm text-muted-foreground">
                {stat.label}
              </p>
              <p className="font-mono text-lg font-semibold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}

      {!currentStats.data.is_up_to_date && (
        <div className="col-span-full">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="font-mono text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Stats are updating in the background
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getRangeDisplayName(range: string): string {
  const rangeMap: Record<string, string> = {
    last_7_days: "7 days",
    last_30_days: "30 days",
    last_6_months: "6 months",
    last_year: "Year",
    all_time: "All time",
  };
  return rangeMap[range] || range;
}

function formatSeconds(seconds: number): string {
  if (!seconds) return "0 mins";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hrs ${minutes} mins`;
  }
  return `${minutes} mins`;
}
