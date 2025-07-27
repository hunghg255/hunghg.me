import { NextResponse } from "next/server";

const WAKATIME_API_BASE = "https://wakatime.com/api/v1";

export async function GET() {
  try {
    const apiKey = process.env.WAKATIME_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Wakatime API key not configured" },
        { status: 500 }
      );
    }

    // Encode API key for Basic Auth
    const encodedKey = Buffer.from(apiKey).toString("base64");

    // Fetch current user data and today's stats
    const [userResponse, todayResponse] = await Promise.all([
      fetch(`${WAKATIME_API_BASE}/users/current`, {
        headers: {
          Authorization: `Basic ${encodedKey}`,
        },
      }),
      fetch(
        `${WAKATIME_API_BASE}/users/current/summaries?start=today&end=today`,
        {
          headers: {
            Authorization: `Basic ${encodedKey}`,
          },
        }
      ),
    ]);

    if (!userResponse.ok || !todayResponse.ok) {
      throw new Error("Failed to fetch from Wakatime API");
    }

    const userData = await userResponse.json();
    const todayData = await todayResponse.json();

    // Get current coding status
    const heartbeatsResponse = await fetch(
      `${WAKATIME_API_BASE}/users/current/heartbeats?date=today`,
      {
        headers: {
          Authorization: `Basic ${encodedKey}`,
        },
      }
    );

    let isCoding = false;
    let currentProject = "";
    let currentLanguage = "";
    let lastActivity = new Date().toISOString();

    if (heartbeatsResponse.ok) {
      const heartbeatsData = await heartbeatsResponse.json();
      const recentHeartbeats = heartbeatsData.data || [];

      if (recentHeartbeats.length > 0) {
        const latestHeartbeat = recentHeartbeats[0];
        const heartbeatTime = new Date(latestHeartbeat.time * 1000);
        const now = new Date();
        const timeDiff = (now.getTime() - heartbeatTime.getTime()) / 1000 / 60; // minutes

        // Consider coding if last heartbeat was within 10 minutes
        isCoding = timeDiff <= 10;
        currentProject = latestHeartbeat.project || "";
        currentLanguage = latestHeartbeat.language || "";
        lastActivity = heartbeatTime.toISOString();
      }
    }

    // Get today's total time
    const todayStats = todayData.data?.[0];
    const totalTime = todayStats?.grand_total?.text || "0 mins";

    const response = {
      data: {
        is_coding: isCoding,
        project: currentProject,
        language: currentLanguage,
        grand_total: {
          text: totalTime,
        },
        modified_at: lastActivity,
        user: {
          display_name: userData.data?.display_name || "Developer",
          username: userData.data?.username || "user",
        },
      },
    };

    // Cache for 2 minutes
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Wakatime API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch coding status",
        data: {
          is_coding: false,
          grand_total: { text: "0 mins" },
          modified_at: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
