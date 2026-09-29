import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getWakatimeCached } from "@/features/wakatime/lib/wakatime-api";

interface WakatimeStatsResponse {
  data: {
    total_seconds: number;
    human_readable_total: string;
    daily_average: number;
    human_readable_daily_average: string;
    languages: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      text: string;
    }>;
    projects: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      text: string;
    }>;
    editors: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      text: string;
    }>;
    operating_systems: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      text: string;
    }>;
    categories: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      text: string;
    }>;
    best_day?: {
      date: string;
      text: string;
      total_seconds: number;
    };
    range: {
      start: string;
      end: string;
      text: string;
    };
    is_up_to_date: boolean;
  };
}

const RANGES = new Set([
  "last_7_days",
  "last_30_days",
  "last_6_months",
  "last_year",
  "all_time",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "last_7_days";

  if (!RANGES.has(range)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  try {
    const { data, fetchedAt } = await getWakatimeCached<WakatimeStatsResponse>(
      `/users/current/stats/${range}`
    );

    return NextResponse.json({ ...data, fetchedAt });
  } catch (error) {
    console.error("Error fetching Wakatime stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch coding stats" },
      { status: 500 }
    );
  }
}
