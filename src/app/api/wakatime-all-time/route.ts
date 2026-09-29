import { NextResponse } from "next/server";

import { getWakatimeCached } from "@/features/wakatime/lib/wakatime-api";

interface WakatimeAllTimeResponse {
  data: {
    daily_average: number;
    decimal: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
    range: {
      end: string;
      end_date: string;
      end_text: string;
      start: string;
      start_date: string;
      start_text: string;
      timezone: string;
    };
    text: string;
    timeout: number;
    total_seconds: number;
  };
}

export async function GET() {
  try {
    const { data, fetchedAt } =
      await getWakatimeCached<WakatimeAllTimeResponse>(
        "/users/current/all_time_since_today"
      );

    return NextResponse.json({
      data,
      lastUpdated: fetchedAt,
    });
  } catch (error) {
    console.error("Error fetching Wakatime all-time stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch all-time coding stats" },
      { status: 500 }
    );
  }
}
