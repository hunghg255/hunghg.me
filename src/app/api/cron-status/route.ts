import { NextResponse } from "next/server";

let lastCronRun: {
  timestamp: string;
  status: "success" | "error";
  message?: string;
} | null = null;

export async function GET() {
  try {
    if (!lastCronRun) {
      return NextResponse.json({
        message: "Chưa có thông tin về lần chạy cronjob",
        lastRun: null,
        status: "unknown",
      });
    }

    const now = new Date();
    const lastRunTime = new Date(lastCronRun.timestamp);
    const timeDiff = now.getTime() - lastRunTime.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return NextResponse.json({
      message: "Thông tin cronjob status",
      lastRun: {
        timestamp: lastCronRun.timestamp,
        status: lastCronRun.status,
        message: lastCronRun.message,
        timeAgo: `${hoursDiff} giờ ${minutesDiff} phút trước`,
        isHealthy: hoursDiff < 25, // Cảnh báo nếu quá 25 giờ không chạy
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Lỗi khi kiểm tra trạng thái cronjob",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Endpoint để cập nhật trạng thái cronjob (chỉ cho internal use)
export async function POST(request: Request) {
  try {
    const { status, message } = await request.json();

    lastCronRun = {
      timestamp: new Date().toISOString(),
      status: status || "success",
      message: message || "Cronjob executed successfully",
    };

    return NextResponse.json({
      message: "Đã cập nhật trạng thái cronjob",
      data: lastCronRun,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Lỗi khi cập nhật trạng thái cronjob",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
