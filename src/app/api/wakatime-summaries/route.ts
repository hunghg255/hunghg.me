import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface WakatimeSummariesResponse {
  data: Array<{
    grand_total: {
      digital: string;
      hours: number;
      minutes: number;
      text: string;
      total_seconds: number;
    };
    projects: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      text: string;
      hours: number;
      minutes: number;
    }>;
    languages: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      text: string;
      hours: number;
      minutes: number;
      seconds: number;
    }>;
    editors: Array<{
      name: string;
      total_seconds: number;
      percent: number;
      digital: string;
      text: string;
      hours: number;
      minutes: number;
      seconds: number;
    }>;
    range: {
      date: string;
      start: string;
      end: string;
      text: string;
      timezone: string;
    };
  }>;
  cumulative_total: {
    seconds: number;
    text: string;
  };
  daily_average: {
    seconds: number;
    text: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "Start and end dates are required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.WAKATIME_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Wakatime API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.wakatime.com/api/v1/users/current/summaries?start=${start}&end=${end}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
        },
        next: { revalidate: 86400 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Wakatime summaries");
    }

    const data: WakatimeSummariesResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Wakatime summaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch coding summaries" },
      { status: 500 }
    );
  }
}
