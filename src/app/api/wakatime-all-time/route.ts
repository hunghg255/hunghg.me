import { NextResponse } from "next/server";

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
    const apiKey = process.env.WAKATIME_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Wakatime API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.wakatime.com/api/v1/users/current/all_time_since_today",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
        },
        next: { revalidate: 86400 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Wakatime all-time stats");
    }

    const data: WakatimeAllTimeResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Wakatime all-time stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch all-time coding stats" },
      { status: 500 }
    );
  }
}
