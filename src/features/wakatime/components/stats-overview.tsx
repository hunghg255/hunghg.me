"use client";

import {
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

interface StatsOverviewData {
  totalTime: string;
  dailyAverage: string;
  isUpToDate: boolean;
  range: string;
}

interface StatCard {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend?: string;
  color: string;
}

export function StatsOverview({
  className,
  range = "last_7_days",
}: {
  className?: string;
  range?: string;
}) {
  const [data, setData] = useState<StatsOverviewData | null>(null);
  const [allTimeData, setAllTimeData] = useState<{
    text: string;
    daily_average: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch current period stats
        const statsResponse = await fetch(`/api/wakatime-stats?range=${range}`);
        const statsData = await statsResponse.json();

        // Fetch all-time stats
        const allTimeResponse = await fetch("/api/wakatime-all-time");
        const allTimeData = await allTimeResponse.json();

        if (statsData.error || allTimeData.error) {
          throw new Error("Failed to fetch data");
        }

        setData({
          totalTime: statsData.data.human_readable_total,
          dailyAverage: statsData.data.human_readable_daily_average,
          isUpToDate: statsData.data.is_up_to_date,
          range: statsData.data.range.text,
        });

        setAllTimeData(allTimeData.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [range]);

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 rounded-lg border border-edge bg-muted p-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || !allTimeData) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <p className="text-muted-foreground">Unable to load stats</p>
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      icon: ClockIcon,
      label: `Total (${getRangeDisplayName(range)})`,
      value: data.totalTime || "0 mins",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: TrendingUpIcon,
      label: "Daily Average",
      value: data.dailyAverage || "0 mins",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: CalendarIcon,
      label: "All Time",
      value: allTimeData.text || "0 mins",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: TargetIcon,
      label: "Daily Avg (All Time)",
      value: formatSeconds(allTimeData.daily_average) || "0 mins",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
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
        </motion.div>
      ))}

      {!data.isUpToDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full"
        >
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="font-mono text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Stats are updating in the background
            </p>
          </div>
        </motion.div>
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
