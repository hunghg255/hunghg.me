import { NextResponse } from "next/server";

import { getWakatimeSnapshot } from "@/features/wakatime/lib/wakatime-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getWakatimeSnapshot();

    return NextResponse.json(snapshot, {
      headers: {
        // Let the CDN answer repeat visits; the page revalidates shortly after
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching Wakatime snapshot:", error);
    return NextResponse.json(
      { error: "Failed to fetch coding stats" },
      { status: 500 }
    );
  }
}
