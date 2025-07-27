import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "last_7_days";

  try {
    const apiKey = process.env.WAKATIME_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Wakatime API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.wakatime.com/api/v1/users/current/stats/${range}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
        },
        next: { revalidate: 86400 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Wakatime stats");
    }

    const data: WakatimeStatsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Wakatime stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch coding stats" },
      { status: 500 }
    );
  }
}
