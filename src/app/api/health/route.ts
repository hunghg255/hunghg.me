import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Gọi API cron-status để lấy thông tin
    const cronStatusResponse = await fetch(
      `${process.env.BASE_URL ? `${process.env.BASE_URL}/api/cron-status` : "https://augustt.site/api/cron-status"}`
    );
    const cronStatus = await cronStatusResponse.json();

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: "running",
        cronjob: cronStatus.lastRun
          ? {
              status: cronStatus.lastRun.status,
              lastRun: cronStatus.lastRun.timestamp,
              timeAgo: cronStatus.lastRun.timeAgo,
              isHealthy: cronStatus.lastRun.isHealthy,
              message: cronStatus.lastRun.message,
            }
          : {
              status: "unknown",
              message: "Chưa có thông tin cronjob",
            },
      },
      message: "Hệ thống đang hoạt động bình thường",
    };

    // Kiểm tra nếu cronjob không healthy
    if (cronStatus.lastRun && !cronStatus.lastRun.isHealthy) {
      health.status = "warning";
      health.message =
        "Cronjob có thể gặp vấn đề - chạy quá lâu rồi không update";
    }

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Lỗi khi kiểm tra trạng thái hệ thống",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
