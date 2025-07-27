import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Helper function để cập nhật trạng thái cronjob
async function updateCronStatus(status: "success" | "error", message: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL ? `${process.env.BASE_URL}/api/cron-status` : "https://augustt.site/api/cron-status"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, message }),
      }
    );

    if (!response.ok) {
      console.warn(
        "⚠️ Không thể cập nhật trạng thái cronjob:",
        await response.text()
      );
    }
  } catch (error) {
    console.warn("⚠️ Lỗi khi cập nhật trạng thái cronjob:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional security)
    const authHeader = request.headers.get("authorization");
    const token = process.env.CRON_SECRET;

    if (token && authHeader !== `Bearer ${token}`) {
      await updateCronStatus("error", "Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Revalidate the stats page
    revalidatePath("/stats");

    console.log("✅ Stats page revalidated successfully");

    // Cập nhật trạng thái cronjob thành công
    await updateCronStatus("success", "Stats page revalidated successfully");

    return NextResponse.json({
      message: "Stats page revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error revalidating stats page:", error);

    // Cập nhật trạng thái cronjob lỗi
    await updateCronStatus(
      "error",
      `Error revalidating stats page: ${error instanceof Error ? error.message : "Unknown error"}`
    );

    return NextResponse.json(
      {
        message: "Error revalidating stats page",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support GET for manual testing
export async function GET() {
  try {
    revalidatePath("/stats");

    // Cập nhật trạng thái cho manual run
    await updateCronStatus("success", "Stats page revalidated manually");

    return NextResponse.json({
      message: "Stats page revalidated manually",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await updateCronStatus(
      "error",
      `Manual revalidation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );

    return NextResponse.json(
      {
        message: "Error revalidating stats page",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
