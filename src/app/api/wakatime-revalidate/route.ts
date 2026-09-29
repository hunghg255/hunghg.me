import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { WAKATIME_CACHE_TAG } from "@/features/wakatime/lib/wakatime-api";

// Every visitor triggers this, so keep upstream WakaTime calls bounded
const MIN_INTERVAL_MS = 60_000;

let lastRevalidatedAt = 0;

export async function POST() {
  const now = Date.now();

  if (now - lastRevalidatedAt < MIN_INTERVAL_MS) {
    return NextResponse.json({ revalidated: false });
  }

  lastRevalidatedAt = now;
  revalidateTag(WAKATIME_CACHE_TAG);

  return NextResponse.json({ revalidated: true });
}
